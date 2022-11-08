"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiFeatures_1 = __importDefault(require("../../helper/ApiFeatures"));
const productModel_1 = require("../model/productModel");
class ProductRepository {
    static async createProduct(data) {
        return await productModel_1.ProductModel.create(data);
    }
    static async findProducts(queryObject, data = {}) {
        const searchableFields = ["name"];
        const features = new ApiFeatures_1.default(productModel_1.ProductModel.find({ ...data, deletedAt: null }), queryObject)
            .filter()
            .search(searchableFields)
            .sort()
            .limitField();
        return await features.mongoseQuery;
    }
    static async updateProductById(id, data = {}) {
        return await productModel_1.ProductModel.findOneAndUpdate({ _id: id, deletedAt: null }, data, { new: true });
    }
    static async deleteProductById(id) {
        return await productModel_1.ProductModel.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date() });
    }
    static async findProductByObject(filter) {
        return await productModel_1.ProductModel.findOne({ ...filter, deletedAt: null });
    }
}
exports.default = ProductRepository;
