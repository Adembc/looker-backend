import { Request } from "express";
import IUser from "../database/model/userModel";

declare interface ProtectedRequest extends Request {
  user: IUser;
}
