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
const express_1 = require("express");
const authController_1 = require("../../../controllers/v1/authController");
const reviewController_1 = require("../../../controllers/v1/reviewController");
const SchemaValidator_1 = __importStar(require("../../../middleware/SchemaValidator"));
const reviewSchema_1 = require("../validationSchema/reviewSchema");
const router = (0, express_1.Router)();
router.use(authController_1.protect);
router
    .route("/:place")
    .get((0, SchemaValidator_1.default)(reviewSchema_1.placeId, SchemaValidator_1.ValidationSource.PARAM), reviewController_1.getReviews)
    .post((0, SchemaValidator_1.default)(reviewSchema_1.placeId, SchemaValidator_1.ValidationSource.PARAM), (0, SchemaValidator_1.default)(reviewSchema_1.addReview), reviewController_1.reviewPlace)
    .put((0, SchemaValidator_1.default)(reviewSchema_1.placeId, SchemaValidator_1.ValidationSource.PARAM), (0, SchemaValidator_1.default)(reviewSchema_1.updateReviewSchema), reviewController_1.updateReview)
    .delete((0, SchemaValidator_1.default)(reviewSchema_1.placeId, SchemaValidator_1.ValidationSource.PARAM), reviewController_1.deleteReview);
exports.default = router;
