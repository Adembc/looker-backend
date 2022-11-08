"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiFeatures_1 = __importDefault(require("../../helper/ApiFeatures"));
const adminModel_1 = require("../model/adminModel");
class AdminRepository {
    static async updateAdminById(adminId, data) {
        return await adminModel_1.Admin.findByIdAndUpdate(adminId, data, {
            new: true,
            runValidators: true,
        });
    }
    static async updateAdmin(admin, data) {
        return await admin.updateOne(data);
    }
    static async createAdmin(data) {
        return await adminModel_1.Admin.create(data);
    }
    static async findAdminByObject(data, selectOpt = "-__v") {
        return await adminModel_1.Admin.findOne(data).select(selectOpt);
    }
    static async findAdminById(id, field = "-__v") {
        return await adminModel_1.Admin.findById(id).select(field);
    }
    static async saveAdmin(admin) {
        return await admin.save();
    }
    static async paginate(queryObject, populateOpt = "") {
        const searchableFields = ["fullName", "email"];
        const features = new ApiFeatures_1.default(adminModel_1.Admin.find({ deletedAt: null }), queryObject)
            .filter()
            .search(searchableFields)
            .sort()
            .limitField();
        return await adminModel_1.Admin.paginate({
            query: features.mongoseQuery,
            limit: +queryObject.limit,
            page: +queryObject.page || 1,
            populate: populateOpt,
        }, queryObject);
    }
}
exports.default = AdminRepository;
