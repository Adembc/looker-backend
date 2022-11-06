import { Types } from "mongoose";
import APIFeatures from "../../helper/ApiFeatures";

import IUser, { User } from "../model/userModel";

export default class UserRepository {
  public static async updateUserById(userId: Types.ObjectId, data: object) {
    return await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
  }

  public static async updateManyUser(filter: object, data: object) {
    return await User.updateMany(filter, data);
  }
  public static async updateUser(user: IUser, data: object) {
    return await user.updateOne(data);
  }
  public static async createUser(data: object): Promise<IUser | null> {
    return await User.create(data);
  }
  public static async findAllUser(data = {}): Promise<IUser[] | null> {
    return await User.find(data);
  }
  public static async countUser(
    data = {},
    limit: number
  ): Promise<number | null> {
    return await User.find(data).limit(limit).countDocuments();
  }

  public static async findUserByObject(
    data: Object,
    selectOpt = "-__v"
  ): Promise<IUser | null> {
    return await User.findOne(data).select(selectOpt);
  }
  public static async findUsersByObject(
    data: Object,
    selectOpt = "-__v"
  ): Promise<IUser[] | null> {
    return await User.find(data).select(selectOpt);
  }
  public static async findUserById(
    id: Types.ObjectId,
    selectOpt = "-__v"
  ): Promise<IUser | null> {
    return await User.findById(id).select(selectOpt);
  }

  public static async saveUser(user: IUser): Promise<IUser | null> {
    return await user.save();
  }
  public static async paginate(queryObject, selcetOpt = "", populateOpt = {}) {
    const searchableFields = ["firstName", "lastName", "phone", "email"];
    const features = new APIFeatures(
      User.find({ deletedAt: null }),
      queryObject
    )
      .filter()
      .search(searchableFields)
      .sort()
      .limitField();
    return await User.paginate(
      {
        query: features.mongoseQuery,
        limit: +queryObject.limit,
        page: +queryObject.page,
        select: selcetOpt,
        populate: populateOpt,
      },
      queryObject
    );
  }
}
