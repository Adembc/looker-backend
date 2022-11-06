import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
// import hpp from 'hpp'
import cors from "cors";

// routes
import adminV1Route from "./routes/v1/admin/index";
import userV1Route from "./routes/v1/user/index";

import errorHandler from "./helper/errorHandler";
import HttpError from "./helper/HttpError";
const app = express();
// midllewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

app.use(express.static("./"));

app.use("/api/v1", adminV1Route);
app.use("/api/v1", userV1Route);

app.use("*", (req, res, next) => {
  next(new HttpError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// global handler error middleware
app.use(errorHandler);
export default app;
