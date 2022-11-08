"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const SchemaValidator_1 = require("../../../middleware/SchemaValidator");
const createUserValidateSchema = joi_1.default.object({
    password: joi_1.default.string().min(8).required(),
    passwordConfirm: joi_1.default.ref("password"),
    email: joi_1.default.string().email(),
    phone: (0, SchemaValidator_1.checkValidPhone)(),
    firstName: joi_1.default.string().min(3).required(),
    lastName: joi_1.default.string().min(3).required(),
})
    .with("password", "passwordConfirm")
    .xor("phone", "email");
const registerUserValidateSchema = joi_1.default.object({
    email: joi_1.default.string().email(),
    phone: (0, SchemaValidator_1.checkValidPhone)(),
    deviceId: joi_1.default.string(),
}).xor("phone", "email");
const signup = joi_1.default.object({
    email: joi_1.default.string().email(),
    phone: (0, SchemaValidator_1.checkValidPhone)(),
    password: joi_1.default.string().min(8).required(),
    passwordConfirm: joi_1.default.ref("password"),
    firstName: joi_1.default.string().required().trim().min(3),
    lastName: joi_1.default.string().required().trim().min(3),
})
    .xor("phone", "email")
    .with("password", "passwordConfirm")
    .with("phone", "countryCode");
const updateUserValidateSchema = joi_1.default.object({
    email: joi_1.default.string().email(),
    phone: (0, SchemaValidator_1.checkValidPhone)(),
    firstName: joi_1.default.string().trim().min(3),
    lastName: joi_1.default.string().trim().min(3),
});
const updateUserPswValidateSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    password: joi_1.default.string().required().min(8),
    passwordConfirm: joi_1.default.ref("password"),
});
const loginUser = joi_1.default.object({
    email: joi_1.default.string().email(),
    phone: (0, SchemaValidator_1.checkValidPhone)(),
    password: joi_1.default.string().required().min(8),
    deviceId: joi_1.default.string(),
}).xor("phone", "email");
const userToken = joi_1.default.object({
    refreshToken: joi_1.default.string().required(),
});
const userCredentialCheck = joi_1.default.object({
    email: joi_1.default.string().email(),
    phone: (0, SchemaValidator_1.checkValidPhone)(),
    countryCode: (0, SchemaValidator_1.JoiObjectId)(),
})
    .xor("phone", "email")
    .with("phone", "countryCode");
const userCredential = joi_1.default.object({
    email: joi_1.default.string().email(),
    phone: (0, SchemaValidator_1.checkValidPhone)(),
}).xor("phone", "email");
const userVerifCode = joi_1.default.object({
    confirmationToken: joi_1.default.string().trim().regex(/[0-9]/).required(),
});
const resetUserPsw = joi_1.default.object({
    email: joi_1.default.string().email(),
    phone: (0, SchemaValidator_1.checkValidPhone)(),
    password: joi_1.default.string().min(8).required(),
    passwordConfirm: joi_1.default.ref("password"),
})
    .xor("phone", "email")
    .with("password", "passwordConfirm");
const completeUser = joi_1.default.object({
    password: joi_1.default.string().min(8).required(),
    passwordConfirm: joi_1.default.ref("password"),
    firstName: joi_1.default.string().required().trim().min(3),
    lastName: joi_1.default.string().required().trim().min(3),
    country: joi_1.default.string().required(),
    learningDuration: joi_1.default.number().greater(0).required(),
}).with("password", "passwordConfirm");
exports.default = {
    createUserAdmin: createUserValidateSchema,
    registerUser: registerUserValidateSchema,
    putUser: updateUserValidateSchema,
    updatePsw: updateUserPswValidateSchema,
    loginUser,
    userToken,
    userCredential,
    userVerifCode,
    resetUserPsw,
    completeUser,
    signup,
    userCredentialCheck,
};
