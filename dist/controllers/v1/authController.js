"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.protect = exports.refreshToken = exports.login = exports.check = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpError_1 = __importDefault(require("../../helper/HttpError"));
const catchAsync_1 = __importDefault(require("../../helper/catchAsync"));
const userRepository_1 = __importDefault(require("../../database/repositories/userRepository"));
const tokenRepository_1 = __importDefault(require("../../database/repositories/tokenRepository"));
const mongoose_1 = require("mongoose");
exports.register = (0, catchAsync_1.default)(async (req, res, next) => {
    const { phone, email, firstName, lastName, password } = req.body;
    const identifier = phone || email;
    const existingUser = await userRepository_1.default.findUserByObject({
        $or: [{ phone: identifier }, { email: identifier }],
    }, "+verified +completed");
    if (existingUser) {
        return next(new HttpError_1.default("email already exists", 400));
    }
    const createdUser = await userRepository_1.default.createUser({
        phone,
        email,
        firstName,
        lastName,
        password,
        [req?.file?.fieldname]: req?.file?.path,
    });
    if (!createdUser) {
        return next(new HttpError_1.default("Could not register this user", 500));
    }
    const accessToken = createdUser.generateToken({ id: createdUser.id }, process.env.JWT_SECRET_STRING, process.env.JWT_EXPIRES);
    const refreshToken = createdUser.generateToken({ id: createdUser.id }, process.env.JWT_SECRET_STRING_REFRESH, process.env.JWT_EXPIRES_REFRESH);
    await tokenRepository_1.default.createToken({ refreshToken });
    res.status(201).json({
        status: "success",
        accessToken,
        refreshToken,
    });
});
exports.check = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, phone } = req.body;
    const identifier = email || phone;
    const user = await userRepository_1.default.findUserByObject({
        $or: [{ phone: identifier }, { email: identifier }],
    });
    if (user)
        return res.status(400).json({
            code: 400,
            status: "fail",
        });
    res.status(200).json({
        code: 200,
        status: "success",
    });
});
exports.login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, phone, password, deviceId } = req.body;
    const identifier = email || phone;
    const users = await userRepository_1.default.findUsersByObject({
        $or: [{ phone: identifier }, { email: identifier }],
    }, "+verified +password");
    if (users && users?.length === 0)
        return next(new HttpError_1.default("Please sign up !", 404));
    let isCorrectPwd = false;
    let user;
    for (let i = 0; i < users.length; i++) {
        if (await users[i].isCorrectPassword(password, users[i].password)) {
            isCorrectPwd = true;
            user = users[i];
            break;
        }
    }
    if (!isCorrectPwd)
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
        return next(new HttpError_1.default("INVALID REFRESH TOKEN !", 404));
    const decoded = jsonwebtoken_1.default.verify(token.refreshToken, process.env.JWT_SECRET_STRING_REFRESH);
    const currentUser = await userRepository_1.default.findUserById(new mongoose_1.Types.ObjectId(decoded.id));
    if (!currentUser)
        return next(new HttpError_1.default("INVALID REFRESH TOKEN !", 404));
    const accessToken = currentUser.generateToken({ id: currentUser.id }, process.env.JWT_SECRET_STRING, process.env.JWT_EXPIRES);
    const refreshTokenGenerated = currentUser.generateToken({ id: currentUser.id }, process.env.JWT_SECRET_STRING_REFRESH, process.env.JWT_EXPIRES_REFRESH);
    await tokenRepository_1.default.findTokenAndDelete({ refreshToken });
    await tokenRepository_1.default.createToken({ refreshToken: refreshTokenGenerated });
    res.status(200).json({
        status: "success",
        accessToken,
        refreshToken: refreshTokenGenerated,
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
    const currentUser = await userRepository_1.default.findUserById(new mongoose_1.Types.ObjectId(decoded.id), "+verified +completed");
    if (!currentUser)
        return next(new HttpError_1.default("User is no longer exist ! ", 404));
    //4 check if change psw after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat))
        return next(new HttpError_1.default("User recently change psw ! login again ", 401));
    //5 check if user account in verified
    // if (!currentUser.verified)
    //   return next(
    //     new HttpError(
    //       "you can not access this route until you verify you account",
    //       401
    //     )
    //   );
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
