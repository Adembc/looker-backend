import { Types } from "mongoose";
import IPlaceproduct, { PlaceproductModel } from "../model/placeproductModel";

export default class PlaceproductRepository {
  public static async updateProductplaceState(
    product: Types.ObjectId,
    place: Types.ObjectId,
    isAvailable: boolean
  ) {
    return await PlaceproductModel.findOneAndUpdate(
      { product, place },
      { product, place, isAvailable },
      { new: true, upsert: true }
    );
  }
}
