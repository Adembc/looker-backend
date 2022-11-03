import { model, Schema, Document, Types } from "mongoose";

export const DOCUMENT_NAME = "Product";
export const COLLECTION_NAME = "products";

export default interface IProduct extends Document {
  name: string;
  img: string;
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
export const ProductModel = model<IProduct>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
