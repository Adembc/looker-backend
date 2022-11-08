"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = "Image";
exports.COLLECTION_NAME = "images";
const schema = new mongoose_1.Schema({
    url: {
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
exports.ImageModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
