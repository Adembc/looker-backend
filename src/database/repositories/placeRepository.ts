import { Types } from "mongoose";
import APIFeatures from "../../helper/ApiFeatures";
import IPlace, { PlaceModel } from "../model/placeModel";

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
}
