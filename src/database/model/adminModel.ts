import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";

export default interface admin extends Document {
  find(arg0: { deletedAt: null });
  fullName: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  verifCode: string;
  verifCodeExpires: Date;
  verifTry: number;
  deletedAt: { type: Date; select: false };
  isCorrectPassword: (a: string, b: string) => {};
  generateToken: (a: { id: string }, b: string, c: string) => {};
  changedPasswordAfter: (a: number) => {};
}
const Schema = mongoose.Schema;
const adminSchema = new Schema<admin>(
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
adminSchema.pre("save", async function (next): Promise<void> {
  // crypt password
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});
// save password changed at
adminSchema.pre("save", function (next: NextFunction) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});
adminSchema.pre(/^find/, function (next: NextFunction) {
  this.find({ deletedAt: null });
  next();
});
// check if password correct
adminSchema.methods.isCorrectPassword = async function (
  psw1: string,
  psw2: string
): Promise<boolean> {
  return await bcrypt.compare(psw1, psw2);
  //auth
};
adminSchema.methods.generateToken = function (
  id: string,
  secert: string,
  expire: string
): String {
  return jwt.sign(id, secert, {
    expiresIn: expire,
  });
};
adminSchema.methods.changedPasswordAfter = function (
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
adminSchema.plugin(mongoosePagination);
export const Admin: Pagination<admin> = mongoose.model<
  admin,
  Pagination<admin>
>("Admin", adminSchema);
