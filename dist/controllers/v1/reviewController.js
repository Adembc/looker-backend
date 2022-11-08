"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.reviewPlace = exports.getReviews = void 0;
const catchAsync_1 = __importDefault(require("../../helper/catchAsync"));
const HttpError_1 = __importDefault(require("../../helper/HttpError"));
const mongoose_1 = require("mongoose");
const reviewRepository_1 = __importDefault(require("../../database/repositories/reviewRepository"));
exports.getReviews = (0, catchAsync_1.default)(async (req, res, next) => {
    const { place } = req.params;
    const { _id: user } = req.user;
    const [data] = await reviewRepository_1.default.getReviews(new mongoose_1.Types.ObjectId(place), user);
    res.status(200).json({
        payload: {
            data: data || null,
        },
    });
});
exports.reviewPlace = (0, catchAsync_1.default)(async (req, res, next) => {
    const { place } = req.params;
    const { _id: user } = req.user;
    const { comment, amount } = req.body;
    const isExist = await reviewRepository_1.default.findReviewByObject({ place, user });
    if (isExist)
        return next(new HttpError_1.default("you've already reviewed this place ", 400));
    const review = await reviewRepository_1.default.addReview({
        place,
        user,
        comment,
        amount,
    });
    res.status(201).json({
        payload: {
            review: {
                _id: review._id,
                place,
                user: req.user,
                comment: review.comment,
                amount: review.amount,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            },
        },
    });
});
exports.updateReview = (0, catchAsync_1.default)(async (req, res, next) => {
    const { place } = req.params;
    const { _id: user } = req.user;
    const doc = await reviewRepository_1.default.updateReview(new mongoose_1.Types.ObjectId(place), user, req.body);
    if (!doc)
        return next(new HttpError_1.default("you should create review first", 400));
    return res.status(200).json({
        payload: {
            review: {
                _id: doc._id,
                place,
                user: req.user,
                comment: doc.comment,
                amount: doc.amount,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            },
        },
    });
});
exports.deleteReview = (0, catchAsync_1.default)(async (req, res, next) => {
    const { place } = req.params;
    const { _id: user } = req.user;
    const doc = await reviewRepository_1.default.deletedReview(new mongoose_1.Types.ObjectId(place), user);
    if (!doc)
        return next(new HttpError_1.default(`can't delete this review`, 404));
    res.status(204).json({});
});
