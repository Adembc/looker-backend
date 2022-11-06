import mongoose, { model, Schema, Document, Types } from "mongoose";
import { DOCUMENT_NAME as User } from "./userModel";
import { DOCUMENT_NAME as Category } from "./categoryModel";

export const DOCUMENT_NAME = "Room";
export const COLLECTION_NAME = "rooms";

export default interface IRoom extends Document {
  users: Types.ObjectId[];
  category: Types.ObjectId;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    users: { type: [mongoose.Types.ObjectId], ref: User },
    category: { type: mongoose.Types.ObjectId, ref: Category },
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
export const RoomModel = model<IRoom>(DOCUMENT_NAME, schema, COLLECTION_NAME);
