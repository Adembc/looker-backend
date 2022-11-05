import { Types } from "mongoose";
import IReview, { ReviewModel } from "../model/reviewModel";

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
    return await ReviewModel.aggregate([
      {
        $match: { deletedAt: null },
      },
    ]);
  }
}
