import { Types } from "mongoose";
import APIFeatures from "../../helper/ApiFeatures";
import ISuggest, { SuggestModel } from "../model/suggestModel";

export default class SuggestRepository {
  public static async createSuggest(data: object): Promise<ISuggest | null> {
    return await SuggestModel.create(data);
  }
  public static async findSuggestionByObject(
    id: Types.ObjectId
  ): Promise<ISuggest | null> {
    return await SuggestModel.findOne({ _id: id, deletedAt: null });
  }
  public static async deleteSuggestion(
    id: Types.ObjectId
  ): Promise<ISuggest | null> {
    return await SuggestModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
  }
  public static async findSuggestions(
    queryObject,
    // popOptions = {},
    data: object = {}
  ): Promise<ISuggest[] | null> {
    const searchableFields = ["type", "data"];
    const features = new APIFeatures(
      SuggestModel.find({ ...data, deletedAt: null }),
      queryObject
    )
      .filter()
      .search(searchableFields)
      .sort()
      .limitField();
    return await features.mongoseQuery;
  }
}
