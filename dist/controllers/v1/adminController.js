"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.getMe = exports.deleteAdmin = exports.updateAdmin = exports.getAdmin = exports.createAdmin = exports.getAdmins = void 0;
const catchAsync_1 = __importDefault(require("../../helper/catchAsync"));
const HttpError_1 = __importDefault(require("../../helper/HttpError"));
const adminRepository_1 = __importDefault(require("../../database/repositories/adminRepository"));
const paginateData_1 = __importDefault(require("../../helper/paginateData"));
exports.getAdmins = (0, catchAsync_1.default)(async (req, res, next) => {
    const data = await adminRepository_1.default.paginate(req.query);
    if (!data)
        return next(new HttpError_1.default("can not get admins", 500));
    const options = {
        dataName: "admins",
        isPaginated: !!req.query.limit,
    };
    res.status(200).json((0, paginateData_1.default)(data, options));
});
exports.createAdmin = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email } = req.body;
    const existingUser = await adminRepository_1.default.findAdminByObject({ email });
    if (existingUser)
        return next(new HttpError_1.default("this identifier is already has an active account", 400));
    const doc = await adminRepository_1.default.createAdmin(req.body);
    if (!doc)
        return next(new HttpError_1.default(`can't create this admin ! try later :( `, 500));
    doc.password = undefined;
    res.status(201).json({
        code: 201,
        status: "success",
        payload: {
            admin: doc,
        },
    });
});
exports.getAdmin = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const doc = await adminRepository_1.default.findAdminById(id);
    if (!doc)
        return next(new HttpError_1.default(`can't find admin with this ID : ${id}`, 404));
    doc.passwordChangedAt = undefined;
    res.status(200).json({
        code: 200,
        status: "success",
        payload: {
            admin: doc,
        },
    });
});
exports.updateAdmin = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { email } = req.body;
    if (email) {
        const existingUser = await adminRepository_1.default.findAdminByObject({ email });
        if (existingUser)
            return next(new HttpError_1.default("this identifier is already has an active account", 400));
    }
    const doc = await adminRepository_1.default.updateAdminById(id, req.body);
    res.status(200).json({
        code: 200,
        status: "success",
        payload: {
            admin: doc,
        },
    });
});
exports.deleteAdmin = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const doc = await adminRepository_1.default.updateAdminById(id, {
        deletedAt: new Date(),
    });
    if (!doc)
        return next(new HttpError_1.default(`can't delete admin with this ID : ${id}`, 404));
    res.status(204).json({});
});
const getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
};
exports.getMe = getMe;
exports.updatePassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const { currentPassword, password } = req.body;
    // 1) Get user from collection
    const user = await adminRepository_1.default.findAdminById(req.user._id, "+password");
    // 2) Check if posted current password is correct
    if (!(await user.isCorrectPassword(currentPassword, user.password))) {
        return next(new HttpError_1.default("Your current password is wrong.", 401));
    }
    // 3) If so, update password
    user.password = password;
    await adminRepository_1.default.saveAdmin(user);
    res.status(200).json({
        code: 200,
        status: "success",
    });
});
