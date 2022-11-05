import { Types } from "mongoose";
import IPlaceproduct, { PlaceproductModel } from "../model/placeProductModel";

export default class PlaceproductRepository {
  public static async updateProductplaceState(
    product: Types.ObjectId,
    place: Types.ObjectId,
    isAvailble: boolean
  ) {
    return await PlaceproductModel.findOneAndUpdate(
      { product, place },
      { product, place, isAvailble },
      { new: true, upsert: true }
    );
  }
}
