import { model, Schema, Document, Types } from "mongoose";
import mongoose from "mongoose";

export const DOCUMENT_NAME = "Category";
export const COLLECTION_NAME = "categories";

export default interface ICategory extends Document {
  name: string;
  img: string;
  products: Types.ObjectId[];
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
    products: {
      type: [mongoose.Types.ObjectId],
      ref: "Product",
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
export const CategoryModel = model<ICategory>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
