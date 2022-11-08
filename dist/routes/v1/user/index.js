"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoute_1 = __importDefault(require("./authRoute"));
const categoryRoute_1 = __importDefault(require("./categoryRoute"));
const placeRoute_1 = __importDefault(require("./placeRoute"));
const suggestRoute_1 = __importDefault(require("./suggestRoute"));
const reviewRoute_1 = __importDefault(require("./reviewRoute"));
const userProfileRoute_1 = __importDefault(require("./userProfileRoute"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use("/auth", authRoute_1.default);
router.use("/user/categories", categoryRoute_1.default);
router.use("/user/places", placeRoute_1.default);
router.use("/user/suggestions", suggestRoute_1.default);
router.use("/user/reviews", reviewRoute_1.default);
router.use("/user", userProfileRoute_1.default);
exports.default = router;
