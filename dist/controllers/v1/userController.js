"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.removeAvatar = exports.updatePassword = exports.getMe = exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = exports.getUsers = void 0;
const catchAsync_1 = __importDefault(require("../../helper/catchAsync"));
const HttpError_1 = __importDefault(require("../../helper/HttpError"));
const userRepository_1 = __importDefault(require("../../database/repositories/userRepository"));
const paginateData_1 = __importDefault(require("../../helper/paginateData"));
const mongoose_1 = require("mongoose");
exports.getUsers = (0, catchAsync_1.default)(async (req, res, next) => {
    const data = await userRepository_1.default.paginate(req.query, "-verifCode -verifCodeExpires");
    if (!data)
        return next(new HttpError_1.default("can not get users", 500));
    const options = {
        dataName: "users",
        isPaginated: !!req.query.limit,
    };
    res.status(200).json((0, paginateData_1.default)(data, options));
});
exports.createUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, phone } = req.body;
    const identifier = phone || email;
    const existingUser = await userRepository_1.default.findUserByObject({
        $or: [{ phone: identifier }, { email: identifier }],
    });
    if (existingUser)
        return next(new HttpError_1.default("this identifier is already has an  account", 400));
    const doc = await userRepository_1.default.createUser({
        ...req.body,
        [req?.file?.fieldname]: req?.file?.path,
    });
    if (!doc)
        return next(new HttpError_1.default(`can't create this user ! try later :( `, 500));
    const user = {
        _id: doc._id,
        firstName: doc.firstName,
        lastName: doc.lastName,
        phone: doc.phone,
        email: doc.email,
        avatar: doc?.avatar,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
    res.status(201).json({
        code: 201,
        status: "success",
        payload: {
            user,
        },
    });
});
exports.getUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const doc = await userRepository_1.default.findUserById(new mongoose_1.Types.ObjectId(id));
    if (!doc)
        return next(new HttpError_1.default(`can't find user with this ID : ${id}`, 404));
    doc.password = undefined;
    doc.passwordChangedAt = undefined;
    res.status(200).json({
        code: 200,
        status: "success",
        payload: {
            user: doc,
        },
    });
});
exports.updateUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { email, phone } = req.body;
    const identifier = phone || email;
    if (identifier) {
        const existingUser = await userRepository_1.default.findUserByObject({
            $or: [{ phone: identifier }, { email: identifier }],
        });
        if (existingUser)
            return next(new HttpError_1.default("this identifier is already exist", 400));
    }
    const doc = await userRepository_1.default.updateUserById(new mongoose_1.Types.ObjectId(id), {
        ...req.body,
        [req?.file?.fieldname]: req?.file.path,
    });
    if (!doc)
        return next(new HttpError_1.default("can not update user with id : " + id, 400));
    const user = {
        _id: doc?._id,
        email: doc?.email,
        firstName: doc?.firstName,
        lastName: doc?.lastName,
        avatar: doc?.avatar,
        createdAt: doc?.createdAt,
        updatedAt: doc?.updatedAt,
        phone: doc?.phone,
    };
    return res.status(200).json({
        code: 200,
        status: "success",
        payload: {
            user,
        },
    });
});
exports.deleteUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const doc = await userRepository_1.default.updateUserById(new mongoose_1.Types.ObjectId(id), {
        deletedAt: new Date(),
    });
    if (!doc)
        return next(new HttpError_1.default(`can't delete user with this ID : ${id}`, 404));
    res.status(204).json({
        status: "success",
        data: null,
    });
});
const getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
};
exports.getMe = getMe;
exports.updatePassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const { currentPassword, password, passwordConfirm } = req.body;
    // 1) Get user from collection
    const user = await userRepository_1.default.findUserById(req.user.id, "+password");
    // 2) Check if posted current password is correct
    if (!(await user.isCorrectPassword(currentPassword, user.password))) {
        return next(new HttpError_1.default("Your current password is wrong.", 401));
    }
    // 3 check psw and psw confirm
    if (password !== passwordConfirm)
        return next(new HttpError_1.default("password and password confirm are not identical :( , try again", 400));
    // 4) If so, update password
    user.password = req.body.password;
    await userRepository_1.default.saveUser(user);
    res.status(200).json({
        code: 200,
        status: "success",
    });
});
exports.removeAvatar = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req.user._id;
    if (!req.user.avatar)
        return next(new HttpError_1.default("you are already without avatar ", 400));
    const user = await userRepository_1.default.updateUserById(userId, { avatar: null });
    if (!user)
        return next(new HttpError_1.default("can not remove avatar try later", 500));
    res.status(200).json({
        code: 200,
        status: "success",
        payload: { user },
    });
});
exports.getUserProfile = (0, catchAsync_1.default)(async (req, res, next) => {
    const userId = req.user._id;
    return res.status(200).json({
        code: 200,
        status: "success",
        payload: {
            user: {
                _id: userId,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                avatar: req.user.avatar,
            },
        },
    });
});
