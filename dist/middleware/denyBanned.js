"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.denyBanned = void 0;
const date_fns_1 = require("date-fns");
const userRepository_1 = __importDefault(require("../database/repositories/userRepository"));
const catchAsync_1 = __importDefault(require("../helper/catchAsync"));
const HttpError_1 = __importDefault(require("../helper/HttpError"));
exports.denyBanned = (0, catchAsync_1.default)(async (req, res, next) => {
    const { _id: userId } = req.user;
    const isBanned = await userRepository_1.default.getBannedByObject({
        userId,
        $or: [{ isPermanently: true }, { banEndsAt: { $gt: (0, date_fns_1.startOfToday)() } }],
    });
    if (isBanned) {
        return next(new HttpError_1.default("user is banned", 403));
    }
    next();
});
