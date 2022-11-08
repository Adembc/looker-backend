"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestModel = exports.SUGGEST_TYPE = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = "Suggest";
exports.COLLECTION_NAME = "suggests";
var SUGGEST_TYPE;
(function (SUGGEST_TYPE) {
    SUGGEST_TYPE[SUGGEST_TYPE["PLACE"] = 1] = "PLACE";
    SUGGEST_TYPE[SUGGEST_TYPE["CATEGORY"] = 2] = "CATEGORY";
    SUGGEST_TYPE[SUGGEST_TYPE["PRODUCT"] = 3] = "PRODUCT";
})(SUGGEST_TYPE = exports.SUGGEST_TYPE || (exports.SUGGEST_TYPE = {}));
const schema = new mongoose_1.Schema({
    type: {
        type: Number,
        enum: [SUGGEST_TYPE.PLACE, SUGGEST_TYPE.CATEGORY, SUGGEST_TYPE.PRODUCT],
        default: SUGGEST_TYPE.PLACE,
    },
    data: {
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
exports.SuggestModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
