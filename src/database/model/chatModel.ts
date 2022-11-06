import mongoose, { model, Schema, Document, Types } from "mongoose";
import { DOCUMENT_NAME as User } from "./userModel";
import { DOCUMENT_NAME as Room } from "./roomModel";

export const DOCUMENT_NAME = "Chat";
export const COLLECTION_NAME = "chats";

export default interface IChat extends Document {
  user: Types.ObjectId;
  room: Types.ObjectId;
  content: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: User },
    room: { type: mongoose.Types.ObjectId, ref: Room },
    content: { type: String, trim: true },
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
export const ChatModel = model<IChat>(DOCUMENT_NAME, schema, COLLECTION_NAME);
