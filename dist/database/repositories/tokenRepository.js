"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const refreshModel_1 = require("../model/refreshModel");
class TokenRepository {
    static async createToken(data) {
        return await refreshModel_1.Token.create(data);
    }
    static async findTokenByObject(data) {
        return await refreshModel_1.Token.findOne(data);
    }
    static async findTokenAndDelete(data) {
        return await refreshModel_1.Token.findOneAndDelete(data);
    }
}
exports.default = TokenRepository;
