import { Types } from "mongoose";
import APIFeatures from "../../helper/ApiFeatures";
import IProduct, { ProductModel } from "../model/productModel";

export default class ProductRepository {
  public static async createProduct(data: object): Promise<IProduct | null> {
    return await ProductModel.create(data);
  }
  public static async findProducts(
    queryObject,
    data: object = {}
  ): Promise<IProduct[] | null> {
    const searchableFields = ["name"];
    const features = new APIFeatures(
      ProductModel.find({ ...data, deletedAt: null }),
      queryObject
    )
      .filter()
      .search(searchableFields)
      .sort()
      .limitField();
    return await features.mongoseQuery;
  }
  public static async updateProductById(
    id: Types.ObjectId,
    data: object = {}
  ): Promise<IProduct | null> {
    return await ProductModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true }
    );
  }
  public static async deleteProductById(
    id: Types.ObjectId
  ): Promise<IProduct | null> {
    return await ProductModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() }
    );
  }
  public static async findProductByObject(
    filter: object
  ): Promise<IProduct | null> {
    return await ProductModel.findOne({ ...filter, deletedAt: null });
  }
}
