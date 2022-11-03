import { model, Schema, Document, Types } from "mongoose";

export const DOCUMENT_NAME = "Place";
export const COLLECTION_NAME = "places";

export default interface IPlace extends Document {
  name: string;
  lat: number;
  lan: number;
  category: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    lat: { type: Number, required: true },
    lan: { type: Number, required: true },
    categroy: {
      type: Schema.Types.ObjectId,
      ref: "Category",
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
export const PlaceModel = model<IPlace>(DOCUMENT_NAME, schema, COLLECTION_NAME);
