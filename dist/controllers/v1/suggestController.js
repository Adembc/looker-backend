"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptSuggestion = exports.deleteSuggestion = exports.getSuggestions = exports.suggestEdit = void 0;
const catchAsync_1 = __importDefault(require("../../helper/catchAsync"));
const HttpError_1 = __importDefault(require("../../helper/HttpError"));
const mongoose_1 = require("mongoose");
const suggestRepository_1 = __importDefault(require("../../database/repositories/suggestRepository"));
const placeRepository_1 = __importDefault(require("../../database/repositories/placeRepository"));
const suggestModel_1 = require("../../database/model/suggestModel");
const categoryRepository_1 = __importDefault(require("../../database/repositories/categoryRepository"));
const productRepository_1 = __importDefault(require("../../database/repositories/productRepository"));
exports.suggestEdit = (0, catchAsync_1.default)(async (req, res, next) => {
    const { type, data } = req.body;
    console.log(req?.files);
    console.log({ data });
    await suggestRepository_1.default.createSuggest({ type, data: JSON.stringify(data) });
    res.status(200).json({
        payload: {
            type,
            data,
        },
    });
});
exports.getSuggestions = (0, catchAsync_1.default)(async (req, res, next) => {
    console.log("it working");
    const suggestions = await suggestRepository_1.default.findSuggestions(req.query);
    console.log({ suggestions });
    res.status(200).json({
        payload: {
            suggestions,
        },
    });
});
exports.deleteSuggestion = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const suggestion = await suggestRepository_1.default.deleteSuggestion(new mongoose_1.Types.ObjectId(id));
    console.log(suggestion);
    if (!suggestion)
        return next(new HttpError_1.default("can not delete suggestion with this id " + id, 404));
    res.status(204).json({});
});
exports.acceptSuggestion = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const suggestion = await suggestRepository_1.default.findSuggestionByObject(new mongoose_1.Types.ObjectId(id));
    if (!suggestion)
        return next(new HttpError_1.default("can not find suggestion with this id " + id, 404));
    const { type, data } = suggestion;
    console.log(type);
    const parsedData = JSON.parse(data);
    console.log({ parsedData });
    // delete parsedData.id;
    let result;
    switch (+type) {
        case suggestModel_1.SUGGEST_TYPE.PLACE:
            result = await placeRepository_1.default.updatePlaceById(new mongoose_1.Types.ObjectId(parsedData.id), parsedData);
            break;
        case suggestModel_1.SUGGEST_TYPE.CATEGORY:
            result = await categoryRepository_1.default.updateCategoryById(parsedData.id, parsedData);
            break;
        case suggestModel_1.SUGGEST_TYPE.PRODUCT:
            result = await productRepository_1.default.updateProductById(parsedData.id, parsedData);
            break;
        default:
            break;
    }
    res.status(200).json({ result, parsedData });
});
