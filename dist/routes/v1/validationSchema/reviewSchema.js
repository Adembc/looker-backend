"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeId = exports.updateReviewSchema = exports.addReview = void 0;
const joi_1 = __importDefault(require("joi"));
const SchemaValidator_1 = require("../../../middleware/SchemaValidator");
exports.addReview = joi_1.default.object({
    comment: joi_1.default.string(),
    amount: joi_1.default.number().min(1).max(5).required(),
}).min(1);
exports.updateReviewSchema = joi_1.default.object({
    comment: joi_1.default.string(),
    amount: joi_1.default.number().min(1).max(5),
}).min(1);
exports.placeId = joi_1.default.object({
    place: (0, SchemaValidator_1.JoiObjectId)().required(),
}).min(1);
