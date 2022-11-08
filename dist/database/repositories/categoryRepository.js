"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiFeatures_1 = __importDefault(require("../../helper/ApiFeatures"));
const categoryModel_1 = require("../model/categoryModel");
class CategoryRepository {
    static async createCategory(data) {
        return await categoryModel_1.CategoryModel.create(data);
    }
    static async findCategories(queryObject, data = {}) {
        const searchableFields = ["name", "products"];
        const features = new ApiFeatures_1.default(categoryModel_1.CategoryModel.find({ ...data, deletedAt: null }), queryObject)
            .filter()
            .search(searchableFields)
            .sort()
            .limitField();
        return await features.mongoseQuery;
    }
    static async updateCategoryById(id, data = {}) {
        return await categoryModel_1.CategoryModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true });
    }
    static async deleteCategoryById(id) {
        return await categoryModel_1.CategoryModel.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date() });
    }
    static async findCategoryByObject(filter) {
        return await categoryModel_1.CategoryModel.findOne({ ...filter, deletedAt: null });
    }
}
exports.default = CategoryRepository;
