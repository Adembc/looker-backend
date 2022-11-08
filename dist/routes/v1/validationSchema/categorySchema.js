"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const SchemaValidator_1 = require("../../../middleware/SchemaValidator");
exports.createCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    products: joi_1.default.array().items((0, SchemaValidator_1.JoiObjectId)()).min(1).required(),
}).min(1);
exports.updateCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(1),
    products: joi_1.default.array().items((0, SchemaValidator_1.JoiObjectId)()).min(1),
}).min(1);
