import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

export const DOCUMENT_NAME = "Admin";
export const COLLECTION_NAME = "admins";
export default interface IAdmin extends Document {
  find(arg0: { deletedAt: null });
  fullName: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: { type: Date; select: false };
  isCorrectPassword: (a: string, b: string) => {};
  generateToken: (a: { id: string }, b: string, c: string) => {};
  changedPasswordAfter: (a: number) => {};
}
const Schema = mongoose.Schema;
const schema = new Schema<IAdmin>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    passwordChangedAt: Date,
    verifCode: { type: String },
    verifCodeExpires: { type: Date },
    verifTry: { type: Number, default: 5, select: false },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, versionKey: false }
);
// hashing password before store it to database
schema.pre("save", async function (next): Promise<void> {
  // crypt password
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});
// save password changed at
schema.pre("save", function (next: NextFunction) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});
schema.pre(/^find/, function (next: NextFunction) {
  this.find({ deletedAt: null });
  next();
});
// check if password correct
schema.methods.isCorrectPassword = async function (
  psw1: string,
  psw2: string
): Promise<boolean> {
  return await bcrypt.compare(psw1, psw2);
  //auth
};
schema.methods.generateToken = function (
  id: string,
  secert: string,
  expire: string
): String {
  return jwt.sign(id, secert, {
    expiresIn: expire,
  });
};
schema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const jwtMillSec = JWTTimestamp * 1000;
    const pswChangeMillSec = this.passwordChangedAt.getTime();
    return jwtMillSec < pswChangeMillSec;
  }
  //false means does not change
  return false;
};
schema.plugin(mongoosePagination);
export const Admin: Pagination<IAdmin> = mongoose.model<
  IAdmin,
  Pagination<IAdmin>
>(DOCUMENT_NAME, schema, COLLECTION_NAME);
