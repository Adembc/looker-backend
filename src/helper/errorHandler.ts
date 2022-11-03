import { NextFunction, Request, Response } from "express";
import HttpError from "./HttpError";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new HttpError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  console.log(err);
  const value = Object.keys(err.keyPattern)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new HttpError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(
    (el: { message: string }) => el.message
  );
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new HttpError(message, 400);
};

const handleJWTError = () =>
  new HttpError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new HttpError("Your token has expired! Please log in again.", 401);

export default (err, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = { ...err };
  if (error.kind === "ObjectId") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  if (process.env.NODE_ENV == "development") {
    res.status(error.statusCode).json({
      status: error.status || err.status,
      error: error,
      message: error.message || err.message,
      stack: error.stack,
    });
  } else {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message || err.message,
    });
  }
};
