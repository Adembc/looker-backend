"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = "Product";
exports.COLLECTION_NAME = "products";
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        default: "",
    },
    img: {
        type: String,
    },
    deletedAt: {
        type: Date,
        select: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.ProductModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
