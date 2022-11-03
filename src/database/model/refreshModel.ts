import mongoose, { Document } from "mongoose";

export default interface refresh extends Document {
  refreshToken: string;
}

const Schema = mongoose.Schema;
const tokenSchema = new Schema<refresh>({
  refreshToken: { type: String },
});

export const Token = mongoose.model("Token", tokenSchema);
