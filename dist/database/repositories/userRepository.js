"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiFeatures_1 = __importDefault(require("../../helper/ApiFeatures"));
const userModel_1 = require("../model/userModel");
class UserRepository {
    static async updateUserById(userId, data) {
        return await userModel_1.User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        });
    }
    static async updateManyUser(filter, data) {
        return await userModel_1.User.updateMany(filter, data);
    }
    static async updateUser(user, data) {
        return await user.updateOne(data);
    }
    static async createUser(data) {
        return await userModel_1.User.create(data);
    }
    static async findAllUser(data = {}) {
        return await userModel_1.User.find(data);
    }
    static async countUser(data = {}, limit) {
        return await userModel_1.User.find(data).limit(limit).countDocuments();
    }
    static async findUserByObject(data, selectOpt = "-__v") {
        return await userModel_1.User.findOne(data).select(selectOpt);
    }
    static async findUsersByObject(data, selectOpt = "-__v") {
        return await userModel_1.User.find(data).select(selectOpt);
    }
    static async findUserById(id, selectOpt = "-__v") {
        return await userModel_1.User.findById(id).select(selectOpt);
    }
    static async saveUser(user) {
        return await user.save();
    }
    static async paginate(queryObject, selcetOpt = "", populateOpt = {}) {
        const searchableFields = ["firstName", "lastName", "phone", "email"];
        const features = new ApiFeatures_1.default(userModel_1.User.find({ deletedAt: null }), queryObject)
            .filter()
            .search(searchableFields)
            .sort()
            .limitField();
        return await userModel_1.User.paginate({
            query: features.mongoseQuery,
            limit: +queryObject.limit,
            page: +queryObject.page,
            select: selcetOpt,
            populate: populateOpt,
        }, queryObject);
    }
}
exports.default = UserRepository;
