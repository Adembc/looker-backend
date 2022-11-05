import { model, Schema, Document, Types } from "mongoose";

export const DOCUMENT_NAME = "Suggest";
export const COLLECTION_NAME = "suggests";

export enum SUGGEST_TYPE {
  "PLACE" = 1,
  "CATEGORY" = 2,
  "PRODUCT" = 3,
}

export default interface ISuggest extends Document {
  type: number;
  data: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    type: {
      type: Number,
      enum: [SUGGEST_TYPE.PLACE, SUGGEST_TYPE.CATEGORY, SUGGEST_TYPE.PRODUCT],
      default: SUGGEST_TYPE.PLACE,
    },
    data: {
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
export const SuggestModel = model<ISuggest>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
