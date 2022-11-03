import { Types } from "mongoose";
import APIFeatures from "../../helper/ApiFeatures";
import ICategory, { CategoryModel } from "../model/categoryModel";

export default class CategoryRepository {
  public static async createCategory(data: object): Promise<ICategory | null> {
    return await CategoryModel.create(data);
  }
  public static async findCategories(
    queryObject,
    data: object = {}
  ): Promise<ICategory[] | null> {
    const searchableFields = ["name", "products"];
    const features = new APIFeatures(
      CategoryModel.find({ ...data, deletedAt: null }),
      queryObject
    )
      .filter()
      .search(searchableFields)
      .sort()
      .limitField();
    return await features.mongoseQuery;
  }
  public static async updateCategoryById(
    id: Types.ObjectId,
    data: object = {}
  ): Promise<ICategory | null> {
    return await CategoryModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true }
    );
  }
  public static async deleteCategoryById(
    id: Types.ObjectId
  ): Promise<ICategory | null> {
    return await CategoryModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() }
    );
  }
  public static async findCategoryByObject(
    filter: object
  ): Promise<ICategory | null> {
    return await CategoryModel.findOne({ ...filter, deletedAt: null });
  }
}
