"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiFeatures_1 = __importDefault(require("../../helper/ApiFeatures"));
const suggestModel_1 = require("../model/suggestModel");
class SuggestRepository {
    static async createSuggest(data) {
        return await suggestModel_1.SuggestModel.create(data);
    }
    static async findSuggestionByObject(id) {
        return await suggestModel_1.SuggestModel.findOne({ _id: id, deletedAt: null });
    }
    static async deleteSuggestion(id) {
        return await suggestModel_1.SuggestModel.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date() }, { new: true });
    }
    static async findSuggestions(queryObject, 
    // popOptions = {},
    data = {}) {
        const searchableFields = ["type", "data"];
        const features = new ApiFeatures_1.default(suggestModel_1.SuggestModel.find({ ...data, deletedAt: null }), queryObject)
            .filter()
            .search(searchableFields)
            .sort()
            .limitField();
        return await features.mongoseQuery;
    }
}
exports.default = SuggestRepository;
