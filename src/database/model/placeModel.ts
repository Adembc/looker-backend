import { NextFunction } from "express";
import mongoose, { model, Schema, Document, Types } from "mongoose";

export const DOCUMENT_NAME = "Place";
export const COLLECTION_NAME = "places";

export enum STATUS {
  REJECTED = 1,
  IN_REVIEW = 2,
  ACCEPTED = 3,
}

export default interface IPlace extends Document {
  name: string;
  description: string;
  lat: number;
  lan: number;
  category: Types.ObjectId;
  // addedBy: Types.ObjectId;
  status: STATUS;
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
    description: {
      type: String,
      default: "",
    },
    lat: { type: Number, required: true },
    lan: { type: Number, required: true },
    status: {
      type: Number,
      enum: [STATUS.REJECTED, STATUS.IN_REVIEW, STATUS.ACCEPTED],
      default: STATUS.IN_REVIEW,
    },
    // addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    category: {
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
