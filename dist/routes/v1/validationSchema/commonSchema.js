"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const SchemaValidator_1 = require("../../../middleware/SchemaValidator");
exports.idSchema = joi_1.default.object({
    id: (0, SchemaValidator_1.JoiObjectId)().required(),
});
