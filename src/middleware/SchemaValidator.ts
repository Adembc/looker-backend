import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import HttpError from "../helper/HttpError";
import util from "util";
export enum ValidationSource {
  BODY = "body",
  HEADER = "headers",
  QUERY = "query",
  PARAM = "params",
  FILE = "file",
  FILES = "files",
}

export const checkValidPhone = () =>
  Joi.string().custom((phone: string, helpers) => {
    // phone should be numeric
    if (Array.from(phone).some((el) => el > "9" || el < "0"))
      return helpers.error("any.invalid");
    // // phone number should startsWith 00 (216) if Tunisia
    // if (!phone.startsWith("00216")) return helpers.error("any.invalid");
    // // should be length of 5+ 8 = 13
    // if (phone.length !== 13) return helpers.error("any.invalid");
    return phone;
  }, "validate phone");

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
    return value;
  }, "Object Id Validation");

export default (
  schema: Joi.ObjectSchema,
  source = ValidationSource.BODY,
  extraFields = {},
  useJoiError = true
) => {
  // Joi validation options
  const validationOptions = {
    abortEarly: false, // abort after the last validation erroror
    stripUnknown: true, // remove unknown keys from the validated data
  };

  // return the validation middleware
  return (req: Request, res: Response, next: NextFunction) => {
    // console.log(
    //   util.inspect(req[source], {
    //     showHidden: false,
    //     depth: null,
    //     colors: true,
    //   })
    // );
    const { value, error } = schema.validate(req[source], validationOptions);

    if (error) {
      const { details } = error;
      const JoiError = details
        .map((i) => i.message.replace(/['"]+/g, ""))
        .join(" , ");

      // Custom Error
      const CustomError =
        "Invalid request data. Please review request and try again.";
      return next(new HttpError(useJoiError ? JoiError : CustomError, 422));
    }
    // Replace req[source] with the data after Joi validation
    req[source] = { ...value, ...extraFields };
    next();
  };
};
