"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceModel = exports.STATUS = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = "Place";
exports.COLLECTION_NAME = "places";
var STATUS;
(function (STATUS) {
    STATUS[STATUS["REJECTED"] = 1] = "REJECTED";
    STATUS[STATUS["IN_REVIEW"] = 2] = "IN_REVIEW";
    STATUS[STATUS["ACCEPTED"] = 3] = "ACCEPTED";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    lat: { type: Number, required: true },
    lan: { type: Number, required: true },
    status: {
        type: Number,
        enum: [STATUS.REJECTED, STATUS.IN_REVIEW, STATUS.ACCEPTED],
        default: STATUS.IN_REVIEW,
    },
    // addedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
    },
    slides: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Image",
    },
    deletedAt: {
        type: Date,
        select: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});
schema.pre(/^find/, function (next) {
    this.populate({
        path: "slides",
        select: "url",
    });
    next();
});
exports.PlaceModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
