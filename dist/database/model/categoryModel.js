"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
exports.DOCUMENT_NAME = "Category";
exports.COLLECTION_NAME = "categories";
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        default: "",
    },
    img: {
        type: String,
    },
    products: {
        type: [mongoose_2.default.Types.ObjectId],
        ref: "Product",
    },
    deletedAt: {
        type: Date,
        select: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.CategoryModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
