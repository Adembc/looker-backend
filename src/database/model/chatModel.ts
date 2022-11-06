import mongoose, { model, Schema, Document, Types } from "mongoose";
import { DOCUMENT_NAME as User } from "./userModel";
import { DOCUMENT_NAME as Room } from "./roomModel";

export const DOCUMENT_NAME = "Room";
export const COLLECTION_NAME = "rooms";

export default interface IRoom extends Document {
  user: Types.ObjectId;
  room: Types.ObjectId;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    user: { type: [mongoose.Types.ObjectId], ref: User },
    room: { type: mongoose.Types.ObjectId, ref: Room },
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
