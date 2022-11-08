"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authAdminController_1 = require("../../../controllers/v1/authAdminController");
const adminController_1 = require("../../../controllers/v1/adminController");
const adminSchema_1 = __importDefault(require("../validationSchema/adminSchema"));
const SchemaValidator_1 = __importDefault(require("../../../middleware/SchemaValidator"));
const router = (0, express_1.Router)();
router.use(authAdminController_1.protect);
router.route("/me").get(adminController_1.getMe, adminController_1.getAdmin);
router
    .route("/update")
    .put(adminController_1.getMe, (0, SchemaValidator_1.default)(adminSchema_1.default.putAdmin), adminController_1.updateAdmin);
router
    .route("/change-password")
    .put((0, SchemaValidator_1.default)(adminSchema_1.default.updatePsw), adminController_1.updatePassword);
exports.default = router;
