"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatCategorySchema = exports.creatCategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.creatCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
}).min(1);
exports.updatCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(1),
}).min(1);
