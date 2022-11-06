import { Types } from "mongoose";
import IReview, { ReviewModel } from "../model/reviewModel";
import { COLLECTION_NAME as User } from "../model/userModel";

export default class ReviewRepository {
  public static async addReview(data: object): Promise<IReview | null> {
    return await ReviewModel.create(data);
  }
  public static async findReviewByObject(
    data: object
  ): Promise<IReview | null> {
    return await ReviewModel.findOne({ ...data, deletedAt: null });
  }
  public static async updateReview(
    place: Types.ObjectId,
    user: Types.ObjectId,
    data: object
  ): Promise<IReview | null> {
    return await ReviewModel.findOneAndUpdate({ place, user }, data, {
      new: true,
    });
  }
  public static async deletedReview(
    place: Types.ObjectId,
    user: Types.ObjectId
  ): Promise<IReview | null> {
    return await ReviewModel.findOneAndDelete({ place, user });
  }
  public static async getReviews(
    place: Types.ObjectId,
    user: Types.ObjectId
  ): Promise<IReview[] | null> {
    console.log(user);
    return await ReviewModel.aggregate([
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
          from: User,
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
