"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productPlace = exports.updatePlaceSchema = exports.createPlaceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const SchemaValidator_1 = require("../../../middleware/SchemaValidator");
exports.createPlaceSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    description: joi_1.default.string(),
    lat: joi_1.default.number().required(),
    lan: joi_1.default.number().required(),
    category: (0, SchemaValidator_1.JoiObjectId)().required(),
}).min(1);
exports.updatePlaceSchema = joi_1.default.object({
    name: joi_1.default.string().min(1),
    lat: joi_1.default.number(),
    description: joi_1.default.string(),
    lan: joi_1.default.number(),
    category: (0, SchemaValidator_1.JoiObjectId)(),
    slides: joi_1.default.array().items((0, SchemaValidator_1.JoiObjectId)()),
    status: joi_1.default.number().min(1).max(3),
}).min(1);
exports.productPlace = joi_1.default.object({
    product: (0, SchemaValidator_1.JoiObjectId)().required(),
    place: (0, SchemaValidator_1.JoiObjectId)().required(),
    isAvailable: joi_1.default.boolean(),
}).min(1);
