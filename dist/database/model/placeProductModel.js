"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceproductModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productModel_1 = require("./productModel");
const placeModel_1 = require("./placeModel");
exports.DOCUMENT_NAME = "Placeproduct";
exports.COLLECTION_NAME = "place-product";
const schema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.default.Types.ObjectId,
        ref: productModel_1.DOCUMENT_NAME,
    },
    place: {
        type: mongoose_1.default.Types.ObjectId,
        ref: placeModel_1.DOCUMENT_NAME,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    deletedAt: {
        type: Date,
        select: false,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.PlaceproductModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
