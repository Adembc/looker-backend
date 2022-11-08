"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestEditSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const suggestModel_1 = require("../../../database/model/suggestModel");
const SchemaValidator_1 = require("../../../middleware/SchemaValidator");
const placeSchema_1 = require("./placeSchema");
const productSchema_1 = require("./productSchema");
exports.suggestEditSchema = joi_1.default.object({
    type: joi_1.default.number()
        .valid(suggestModel_1.SUGGEST_TYPE.CATEGORY, suggestModel_1.SUGGEST_TYPE.PLACE, suggestModel_1.SUGGEST_TYPE.PRODUCT)
        .required(),
    data: joi_1.default.when("type", {
        is: suggestModel_1.SUGGEST_TYPE.PLACE,
        then: placeSchema_1.updatePlaceSchema.append({ id: (0, SchemaValidator_1.JoiObjectId)().required() }),
    })
        .when("type", {
        is: suggestModel_1.SUGGEST_TYPE.PRODUCT,
        then: productSchema_1.updateProductSchema.append({ id: (0, SchemaValidator_1.JoiObjectId)().required() }),
    })
        .when("type", {
        is: suggestModel_1.SUGGEST_TYPE.CATEGORY,
        then: productSchema_1.updateProductSchema.append({ id: (0, SchemaValidator_1.JoiObjectId)().required() }),
    }),
});
