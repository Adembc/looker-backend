"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../../controllers/v1/authController");
const SchemaValidator_1 = __importDefault(require("../../../middleware/SchemaValidator"));
const userSchema_1 = __importDefault(require("../validationSchema/userSchema"));
const uploadMedia_1 = __importDefault(require("../../../middleware/uploadMedia"));
const router = (0, express_1.Router)();
router
    .route("/signup")
    .post((0, uploadMedia_1.default)("users", "avatar"), (0, SchemaValidator_1.default)(userSchema_1.default.signup), authController_1.register);
router
    .route("/check")
    .post((0, SchemaValidator_1.default)(userSchema_1.default.userCredentialCheck), authController_1.check);
router.route("/login").post((0, SchemaValidator_1.default)(userSchema_1.default.loginUser), authController_1.login);
router
    .route("/refresh")
    .post((0, SchemaValidator_1.default)(userSchema_1.default.userToken), authController_1.refreshToken);
router.route("/logout").post((0, SchemaValidator_1.default)(userSchema_1.default.userToken), authController_1.logout);
exports.default = router;
