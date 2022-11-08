"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const createAdminValidateSchema = joi_1.default.object({
    password: joi_1.default.string().required(),
    passwordConfirm: joi_1.default.ref("password"),
    email: joi_1.default.string().email().required(),
    fullName: joi_1.default.string().required(),
}).with("password", "passwordConfirm");
const updateAdminValidateSchema = joi_1.default.object({
    email: joi_1.default.string().email(),
    fullName: joi_1.default.string(),
});
const updateAdminPswValidateSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    password: joi_1.default.string().required().min(8),
    passwordConfirm: joi_1.default.ref("password"),
});
const loginAdmin = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required().min(8),
});
const adminToken = joi_1.default.object({
    refreshToken: joi_1.default.string().required(),
});
const adminCredential = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
const adminVerifCode = joi_1.default.object({
    confirmationToken: joi_1.default.string().trim().regex(/[0-9]/).required(),
});
const resetAdminPsw = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    passwordConfirm: joi_1.default.ref("password"),
});
exports.default = {
    createUserAdmin: createAdminValidateSchema,
    putAdmin: updateAdminValidateSchema,
    updatePsw: updateAdminPswValidateSchema,
    loginAdmin,
    adminToken,
    adminCredential,
    adminVerifCode,
    resetAdminPsw,
};
