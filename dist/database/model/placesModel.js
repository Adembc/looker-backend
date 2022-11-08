"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = "Place";
exports.COLLECTION_NAME = "places";
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        default: "",
        unique: true,
        index: true,
    },
    lat: { type: Number, required: true },
    lan: { type: Number, required: true },
    categroy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
    },
    deletedAt: {
        type: Date,
        select: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.TaskModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
