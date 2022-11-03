import mongoose, { Document, HydratedDocument, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

export default interface user extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password: string;
  verifCode?: string;
  verifCodeExpires?: Date;
  verified: boolean;
  verifTry?: number;
  completed?: boolean;
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
const userSchema = new Schema<user>(
  {
    firstName: { type: String, trim: true, min: 3 },
    lastName: { type: String, trim: true, min: 3 },
    phone: { type: String },
    email: { type: String },
    password: { type: String, select: false },
    avatar: {
      type: String,
    },
    verifCode: { type: String },
    verifCodeExpires: { type: Date },

    verifTry: { type: Number, default: 5, select: false },
    verified: { type: Boolean, default: false, select: false },
    passwordChangedAt: Date,
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, versionKey: false }
);
// hashing password before store it to database
userSchema.pre("save", async function (next): Promise<void> {
  // crypt password
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});
// save password changed at
userSchema.pre("save", function (next: NextFunction) {
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
userSchema.methods.isCorrectPassword = async function (
  psw1: string,
  psw2: string
): Promise<boolean> {
  return await bcrypt.compare(psw1, psw2);
};
userSchema.methods.generateToken = function (
  id: string,
  secert: string,
  expire: string
): String {
  return jwt.sign(id, secert, {
    expiresIn: expire,
  });
};
userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const jwtMillSec = JWTTimestamp * 1000;
    const pswChangeMillSec = this.passwordChangedAt.getTime();
    return jwtMillSec < pswChangeMillSec;
  }
  //false means does not change
  return false;
};
userSchema.pre(/^find/, function (next: NextFunction) {
  this.find({ deletedAt: null });
  next();
});

userSchema.plugin(mongoosePagination);
export const User: Pagination<user> = mongoose.model<user, Pagination<user>>(
  "User",
  userSchema
);
