import { model, Schema, Document, Types } from "mongoose";

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
    name: {
      type: String,
      default: "",
    },
    img: {
      type: String,
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
export const ReviewModel = model<IReview>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
