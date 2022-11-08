"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const uploadMedia = (folder, fieldName = "") => {
    cloudinary_1.default.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY_CLOUDINARY,
        api_secret: process.env.API_SECRET_CLOUDINARY,
    });
    const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.default.v2,
        params: {
            //@ts-ignore
            resource_type: "auto",
            //@ts-ignore
            folder,
        },
    });
    const upload = (0, multer_1.default)({ storage });
    if (!fieldName)
        return upload.any();
    return upload.single(fieldName);
};
exports.default = uploadMedia;
