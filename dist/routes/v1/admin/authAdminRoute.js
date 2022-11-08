"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authAdminController_1 = require("../../../controllers/v1/authAdminController");
const SchemaValidator_1 = __importDefault(require("../../../middleware/SchemaValidator"));
const adminSchema_1 = __importDefault(require("../validationSchema/adminSchema"));
const router = (0, express_1.Router)();
router.route("/login").post((0, SchemaValidator_1.default)(adminSchema_1.default.loginAdmin), authAdminController_1.login);
router
    .route("/refresh")
    .post((0, SchemaValidator_1.default)(adminSchema_1.default.adminToken), authAdminController_1.refreshToken);
router.route("/logout").post((0, SchemaValidator_1.default)(adminSchema_1.default.adminToken), authAdminController_1.logout);
exports.default = router;
