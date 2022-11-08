"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../../controllers/v1/authController");
const categoryController_1 = require("../../../controllers/v1/categoryController");
const router = (0, express_1.Router)();
router.use(authController_1.protect);
router.route("/").get(categoryController_1.getCategories);
exports.default = router;
