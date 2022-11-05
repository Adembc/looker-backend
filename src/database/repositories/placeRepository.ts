import { Types } from "mongoose";
import APIFeatures from "../../helper/ApiFeatures";
import IPlace, { PlaceModel, STATUS } from "../model/placeModel";
import { COLLECTION_NAME as Image } from "../model/imageModel";
import { COLLECTION_NAME as Category } from "../model/categoryModel";
import { COLLECTION_NAME as Product } from "../model/productModel";
import { COLLECTION_NAME as Placeproduct } from "../model/placeproductModel";
export default class PlaceRepository {
  public static async createPlace(data: object): Promise<IPlace | null> {
    return await PlaceModel.create(data);
  }
  public static async findPlaces(
    queryObject,
    popOptions = {},
    data: object = {}
  ): Promise<IPlace[] | null> {
    const searchableFields = ["name", "lat", "lan"];
    const features = new APIFeatures(
      PlaceModel.find({ ...data, deletedAt: null }).populate(popOptions),
      queryObject
    )
      .filter()
      .search(searchableFields)
      .sort()
      .limitField();
    return await features.mongoseQuery;
  }
  public static async updatePlaceById(
    id: Types.ObjectId,
    data: object = {}
  ): Promise<IPlace | null> {
    return await PlaceModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true }
    );
  }
  public static async deletePlaceById(
    id: Types.ObjectId
  ): Promise<IPlace | null> {
    return await PlaceModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() }
    );
  }
  public static async findPlaceByObject(
    filter: object
  ): Promise<IPlace | null> {
    return await PlaceModel.findOne({ ...filter, deletedAt: null });
  }
  public static async findPlaceForUser(
    filter: object
  ): Promise<IPlace[] | null> {
    return await PlaceModel.aggregate([
      {
        $match: {
          deletedAt: null,
          status: STATUS.ACCEPTED,
        },
      },
      {
        $lookup: {
          from: Image,
          localField: "slides",
          foreignField: "_id",
          as: "slides",
        },
      },
      {
        $lookup: {
          from: Category,
          as: "category",
          let: { categoryId: "$category", placeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$categoryId"] },
                    { $lte: ["$deletedAt", null] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: Product,
                as: "products",
                let: { products: "$products", placeId: "$$placeId" },
                pipeline: [
                  {
                    $match: {
                      deletedAt: null,
                      $expr: { $in: ["$_id", "$$products"] },
                    },
                  },
                  {
                    $lookup: {
                      from: Placeproduct,
                      as: "check",
                      localField: "_id",
                      foreignField: "product",
                    },
                  },
                  {
                    $addFields: {
                      items: {
                        $filter: {
                          input: "$check",
                          as: "item",
                          cond: { $eq: ["$$item.place", "$$placeId"] },
                        },
                      },
                    },
                  },
                  {
                    $addFields: {
                      isAvailable: {
                        $cond: {
                          if: { $gt: [{ $size: "$items" }, 0] },
                          then: { $first: "$items.isAvailable" },
                          else: "unknown",
                        },
                      },
                    },
                  },
                  {
                    $project: {
                      check: 0,
                      items: 0,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $unwind: "$category",
      },
    ]);
  }
}
