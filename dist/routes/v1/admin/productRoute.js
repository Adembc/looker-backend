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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authAdminController_1 = require("../../../controllers/v1/authAdminController");
const productController_1 = require("../../../controllers/v1/productController");
const SchemaValidator_1 = __importStar(require("../../../middleware/SchemaValidator"));
const uploadMedia_1 = __importDefault(require("../../../middleware/uploadMedia"));
const commonSchema_1 = require("../validationSchema/commonSchema");
const productSchema_1 = require("../validationSchema/productSchema");
const router = (0, express_1.Router)();
router.use(authAdminController_1.protect);
router
    .route("/")
    .get(productController_1.getProducts)
    .post((0, uploadMedia_1.default)("products", "img"), (0, SchemaValidator_1.default)(productSchema_1.createProductSchema), productController_1.createProduct);
router
    .route("/:id")
    .put((0, uploadMedia_1.default)("products", "img"), (0, SchemaValidator_1.default)(commonSchema_1.idSchema, SchemaValidator_1.ValidationSource.PARAM), (0, SchemaValidator_1.default)(productSchema_1.updateProductSchema), productController_1.updateProduct)
    .delete((0, SchemaValidator_1.default)(commonSchema_1.idSchema, SchemaValidator_1.ValidationSource.PARAM), productController_1.deleteProduct);
exports.default = router;
