import mongoose, { Document, HydratedDocument, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

export const DOCUMENT_NAME = "User";
export const COLLECTION_NAME = "users";

export default interface IUser extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password: string;
  passwordChangedAt?: Date;
  avatar: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  find?: (data: object) => {};
  _update: { wordsScore: number; timeScore: number };
  isCorrectPassword: (a: string, b: string) => {};
  generateToken: (a: { id: string }, b: string, c: string) => {};
  changedPasswordAfter: (a: number) => {};
}
const Schema = mongoose.Schema;
const schema = new Schema<IUser>(
  {
    firstName: { type: String, trim: true, min: 3 },
    lastName: { type: String, trim: true, min: 3 },
    phone: { type: String },
    email: { type: String },
    password: { type: String, select: false },
    avatar: {
      type: String,
    },
    passwordChangedAt: Date,
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
  if (
    !this.isModified("password") ||
    this.isNew ||
    !this.password ||
    !this.passwordChangedAt
  )
    return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});
// check if password correct
schema.methods.isCorrectPassword = async function (
  psw1: string,
  psw2: string
): Promise<boolean> {
  return await bcrypt.compare(psw1, psw2);
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
schema.pre(/^find/, function (next: NextFunction) {
  this.find({ deletedAt: null });
  next();
});

schema.plugin(mongoosePagination);
export const User: Pagination<IUser> = mongoose.model<IUser, Pagination<IUser>>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
