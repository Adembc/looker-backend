import mongoose, { model, Schema, Document, Types } from "mongoose";
import { DOCUMENT_NAME as Product } from "./productModel";
import { DOCUMENT_NAME as Place } from "./placeModel";

export const DOCUMENT_NAME = "Placeproduct";
export const COLLECTION_NAME = "place-product";

export default interface IPlaceproduct extends Document {
  place: Types.ObjectId;
  product: Types.ObjectId;
  isAvailable: boolean;
  deletedAt?: Date;
}

const schema = new Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: Product,
    },
    place: {
      type: mongoose.Types.ObjectId,
      ref: Place,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export const PlaceproductModel = model<IPlaceproduct>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
