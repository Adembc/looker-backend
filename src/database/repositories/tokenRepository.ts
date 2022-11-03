import { ObjectId } from "mongoose";
import refresh, { Token } from "../model/refreshModel";

export default class TokenRepository {
  public static async createToken(data: object): Promise<refresh | null> {
    return await Token.create(data);
  }
  public static async findTokenByObject(data: Object): Promise<refresh | null> {
    return await Token.findOne(data);
  }
  public static async findTokenAndDelete(
    data: object
  ): Promise<refresh | null> {
    return await Token.findOneAndDelete(data);
  }
}
