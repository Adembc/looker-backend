import { ObjectId } from "mongoose";
import APIFeatures from "../../helper/ApiFeatures";
import admin, { Admin } from "../model/adminModel";

export default class AdminRepository {
  public static async updateAdminById(
    adminId: ObjectId | string,
    data: object
  ) {
    return await Admin.findByIdAndUpdate(adminId, data, {
      new: true,
      runValidators: true,
    });
  }
  public static async updateAdmin(admin: admin, data: object) {
    return await admin.updateOne(data);
  }
  public static async createAdmin(data: object): Promise<admin | null> {
    return await Admin.create(data);
  }
  public static async findAdminByObject(
    data: Object,
    selectOpt = "-__v"
  ): Promise<admin | null> {
    return await Admin.findOne(data).select(selectOpt);
  }
  public static async findAdminById(
    id: ObjectId | string,
    field: string = "-__v"
  ): Promise<admin | null> {
    return await Admin.findById(id).select(field);
  }
  public static async saveAdmin(admin: admin): Promise<admin | null> {
    return await admin.save();
  }
  public static async paginate(queryObject, populateOpt: object | string = "") {
    const searchableFields = ["fullName", "email"];
    const features = new APIFeatures(
      Admin.find({ deletedAt: null }),
      queryObject
    )
      .filter()
      .search(searchableFields)
      .sort()
      .limitField();
    return await Admin.paginate(
      {
        query: features.mongoseQuery,
        limit: +queryObject.limit,
        page: +queryObject.page || 1,
        populate: populateOpt,
      },
      queryObject
    );
  }
}
