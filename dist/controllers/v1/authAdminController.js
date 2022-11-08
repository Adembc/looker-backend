"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.protect = exports.refreshToken = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpError_1 = __importDefault(require("../../helper/HttpError"));
const catchAsync_1 = __importDefault(require("../../helper/catchAsync"));
const tokenRepository_1 = __importDefault(require("../../database/repositories/tokenRepository"));
const adminRepository_1 = __importDefault(require("../../database/repositories/adminRepository"));
exports.login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await adminRepository_1.default.findAdminByObject({ email }, "+password");
    if (!user || !(await user.isCorrectPassword(password, user.password)))
        return next(new HttpError_1.default("Please Provide credentials Correctly", 404));
    const accessToken = user.generateToken({ id: user.id }, process.env.JWT_SECRET_STRING, process.env.JWT_EXPIRES);
    const refreshToken = user.generateToken({ id: user.id }, process.env.JWT_SECRET_STRING_REFRESH, process.env.JWT_EXPIRES_REFRESH);
    await tokenRepository_1.default.createToken({ refreshToken });
    res.status(200).json({
        status: "success",
        accessToken,
        refreshToken,
    });
});
exports.refreshToken = (0, catchAsync_1.default)(async (req, res, next) => {
    const { refreshToken } = req.body;
    const token = await tokenRepository_1.default.findTokenByObject({ refreshToken });
    if (!token)
        return next(new HttpError_1.default("Token does not exist", 401));
    const decoded = (await jsonwebtoken_1.default.verify(token.refreshToken, process.env.JWT_SECRET_STRING_REFRESH));
    const currentUser = await adminRepository_1.default.findAdminById(decoded.id);
    if (!currentUser)
        return next(new HttpError_1.default("INVALID REFRESH TOKEN ! ", 404));
    const accessToken = currentUser.generateToken({ id: currentUser.id }, process.env.JWT_SECRET_STRING, process.env.JWT_EXPIRES);
    res.status(200).json({
        status: "success",
        accessToken,
    });
});
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
        return next(new HttpError_1.default("You're Not Logged In ! ", 401));
    // 2 verify
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_STRING);
    // 3 check if user still exist
    const currentUser = await adminRepository_1.default.findAdminById(decoded.id);
    if (!currentUser)
        return next(new HttpError_1.default("Admin not  exist ! ", 404));
    //4 check if change psw after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat))
        return next(new HttpError_1.default("admin recently change psw ! login again ", 401));
    req.user = currentUser;
    next();
});
exports.logout = (0, catchAsync_1.default)(async (req, res, next) => {
    const { refreshToken } = req.body;
    const token = await tokenRepository_1.default.findTokenAndDelete({ refreshToken });
    if (!token)
        return next(new HttpError_1.default("Invalid Token", 404));
    res.status(204).json({});
});
