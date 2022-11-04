import { model, Schema, Document, Types } from "mongoose";

export const DOCUMENT_NAME = "Suggest";
export const COLLECTION_NAME = "suggests";

export default interface ISuggest extends Document {
  type: number;
  data: { name: string; category };
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
export const SuggestModel = model<ISuggest>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
