"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../../controllers/v1/authController");
const placeController_1 = require("../../../controllers/v1/placeController");
const productController_1 = require("../../../controllers/v1/productController");
const SchemaValidator_1 = __importDefault(require("../../../middleware/SchemaValidator"));
const uploadMedia_1 = __importDefault(require("../../../middleware/uploadMedia"));
const placeSchema_1 = require("../validationSchema/placeSchema");
const router = (0, express_1.Router)();
router.use(authController_1.protect);
router.route("/update").put((0, SchemaValidator_1.default)(placeSchema_1.productPlace), productController_1.updateProductState);
router
    .route("/")
    .get(placeController_1.getUserPlaces)
    .post((0, uploadMedia_1.default)("slides"), (0, SchemaValidator_1.default)(placeSchema_1.createPlaceSchema), placeController_1.createPlace);
exports.default = router;
