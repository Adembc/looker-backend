import { NextFunction } from "express";
import { model, Schema, Document, Types } from "mongoose";

export const DOCUMENT_NAME = "Place";
export const COLLECTION_NAME = "places";

export default interface IPlace extends Document {
  name: string;
  lat: number;
  lan: number;
  category: Types.ObjectId;
  slides: Types.ObjectId[];
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
    slides: {
      type: [Schema.Types.ObjectId],
      ref: "Image",
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
schema.pre(/^find/, function (next: NextFunction) {
  this.populate({
    path: "slides",
    select: "url",
  });
  next();
});
export const PlaceModel = model<IPlace>(DOCUMENT_NAME, schema, COLLECTION_NAME);
