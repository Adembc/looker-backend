"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../../controllers/v1/authController");
const userController_1 = require("../../../controllers/v1/userController");
const SchemaValidator_1 = __importDefault(require("../../../middleware/SchemaValidator"));
const uploadMedia_1 = __importDefault(require("../../../middleware/uploadMedia"));
const userSchema_1 = __importDefault(require("../validationSchema/userSchema"));
const router = (0, express_1.Router)();
router.use(authController_1.protect);
router.route("/me").get(userController_1.getUserProfile);
router
    .route("/update")
    .put((0, uploadMedia_1.default)("users", "avatar"), userController_1.getMe, (0, SchemaValidator_1.default)(userSchema_1.default.putUser), userController_1.updateUser);
router
    .route("/change-password")
    .put((0, SchemaValidator_1.default)(userSchema_1.default.updatePsw), userController_1.updatePassword);
router.route("/remove-avatar").get(userController_1.removeAvatar);
exports.default = router;
