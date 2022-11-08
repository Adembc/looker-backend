"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
// import hpp from 'hpp'
const cors_1 = __importDefault(require("cors"));
// routes
const index_1 = __importDefault(require("./routes/v1/admin/index"));
const index_2 = __importDefault(require("./routes/v1/user/index"));
const errorHandler_1 = __importDefault(require("./helper/errorHandler"));
const HttpError_1 = __importDefault(require("./helper/HttpError"));
const app = (0, express_1.default)();
// midllewares
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
app.use((0, xss_clean_1.default)());
app.use(express_1.default.static("./"));
app.use("/api/v1", index_1.default);
app.use("/api/v1", index_2.default);
app.use("*", (req, res, next) => {
    next(new HttpError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
// global handler error middleware
app.use(errorHandler_1.default);
exports.default = app;
