import mongoose, { model, Schema, Document, Types } from "mongoose";
import { DOCUMENT_NAME as User } from "./userModel";
import { DOCUMENT_NAME as Place } from "./placeModel";

export const DOCUMENT_NAME = "Review";
export const COLLECTION_NAME = "reviews";

export default interface IReview extends Document {
  user: Types.ObjectId;
  place: Types.ObjectId;
  amount: number;
  comment: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: User },
    place: { type: mongoose.Types.ObjectId, ref: Place },
    amount: { type: Number },
    comment: { type: String, trim: true, default: "" },
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
export const ReviewModel = model<IReview>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
