"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reviewModel_1 = require("../model/reviewModel");
const userModel_1 = require("../model/userModel");
class ReviewRepository {
    static async addReview(data) {
        return await reviewModel_1.ReviewModel.create(data);
    }
    static async findReviewByObject(data) {
        return await reviewModel_1.ReviewModel.findOne({ ...data, deletedAt: null });
    }
    static async updateReview(place, user, data) {
        return await reviewModel_1.ReviewModel.findOneAndUpdate({ place, user }, data, {
            new: true,
        });
    }
    static async deletedReview(place, user) {
        return await reviewModel_1.ReviewModel.findOneAndDelete({ place, user });
    }
    static async getReviews(place, user) {
        console.log(user);
        return await reviewModel_1.ReviewModel.aggregate([
            {
                $match: { place },
            },
            {
                $addFields: {
                    isUser: {
                        $cond: {
                            if: { $eq: ["$user", user] },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            { $sort: { isUser: -1, createdAt: -1 } },
            {
                $lookup: {
                    from: userModel_1.COLLECTION_NAME,
                    as: "user",
                    localField: "user",
                    foreignField: "_id",
                },
            },
            {
                $group: {
                    _id: "$place",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                    reviews: { $push: "$$ROOT" }, //keep the original document
                },
            },
            {
                $project: {
                    avg: { $round: [{ $divide: ["$total", "$count"] }, 1] },
                    count: 1,
                    reviews: 1,
                },
            },
        ]);
    }
}
exports.default = ReviewRepository;
