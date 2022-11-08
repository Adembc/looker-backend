"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiObjectId = exports.checkValidPhone = exports.ValidationSource = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const HttpError_1 = __importDefault(require("../helper/HttpError"));
var ValidationSource;
(function (ValidationSource) {
    ValidationSource["BODY"] = "body";
    ValidationSource["HEADER"] = "headers";
    ValidationSource["QUERY"] = "query";
    ValidationSource["PARAM"] = "params";
    ValidationSource["FILE"] = "file";
    ValidationSource["FILES"] = "files";
})(ValidationSource = exports.ValidationSource || (exports.ValidationSource = {}));
const checkValidPhone = () => joi_1.default.string().custom((phone, helpers) => {
    // phone should be numeric
    if (Array.from(phone).some((el) => el > "9" || el < "0"))
        return helpers.error("any.invalid");
    // // phone number should startsWith 00 (216) if Tunisia
    // if (!phone.startsWith("00216")) return helpers.error("any.invalid");
    // // should be length of 5+ 8 = 13
    // if (phone.length !== 13) return helpers.error("any.invalid");
    return phone;
}, "validate phone");
exports.checkValidPhone = checkValidPhone;
const JoiObjectId = () => joi_1.default.string().custom((value, helpers) => {
    if (!mongoose_1.Types.ObjectId.isValid(value))
        return helpers.error("any.invalid");
    return value;
}, "Object Id Validation");
exports.JoiObjectId = JoiObjectId;
exports.default = (schema, source = ValidationSource.BODY, extraFields = {}, useJoiError = true) => {
    // Joi validation options
    const validationOptions = {
        abortEarly: false,
        stripUnknown: true, // remove unknown keys from the validated data
    };
    // return the validation middleware
    return (req, res, next) => {
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
            const CustomError = "Invalid request data. Please review request and try again.";
            return next(new HttpError_1.default(useJoiError ? JoiError : CustomError, 422));
        }
        // Replace req[source] with the data after Joi validation
        req[source] = { ...value, ...extraFields };
        next();
    };
};
