import { model, Schema, Document, Types } from "mongoose";

export const DOCUMENT_NAME = "Image";
export const COLLECTION_NAME = "images";

export default interface IImage extends Document {
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const schema = new Schema(
  {
    url: {
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
export const ImageModel = model<IImage>(DOCUMENT_NAME, schema, COLLECTION_NAME);
