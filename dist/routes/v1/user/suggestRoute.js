"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../../controllers/v1/authController");
const suggestController_1 = require("../../../controllers/v1/suggestController");
const SchemaValidator_1 = __importDefault(require("../../../middleware/SchemaValidator"));
const uploadMedia_1 = __importDefault(require("../../../middleware/uploadMedia"));
const suggestSchema_1 = require("../validationSchema/suggestSchema");
const router = (0, express_1.Router)();
router.use(authController_1.protect);
router
    .route("/")
    .post((0, uploadMedia_1.default)("suggest"), (0, SchemaValidator_1.default)(suggestSchema_1.suggestEditSchema), suggestController_1.suggestEdit);
exports.default = router;
