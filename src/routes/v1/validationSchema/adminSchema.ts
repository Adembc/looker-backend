import Joi from "joi";
import {
  checkValidPhone,
  JoiObjectId,
} from "../../../middleware/SchemaValidator";

const createAdminValidateSchema = Joi.object({
  password: Joi.string().required(),
  passwordConfirm: Joi.ref("password"),
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
}).with("password", "passwordConfirm");

const updateAdminValidateSchema = Joi.object({
  email: Joi.string().email(),
  fullName: Joi.string(),
});

const updateAdminPswValidateSchema = Joi.object({
  currentPassword: Joi.string().required(),
  password: Joi.string().required().min(8),
  passwordConfirm: Joi.ref("password"),
});

const adminById = Joi.object({
  id: JoiObjectId().required(),
});

const loginAdmin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

const adminToken = Joi.object({
  refreshToken: Joi.string().required(),
});

const adminCredential = Joi.object({
  email: Joi.string().email().required(),
});

const adminVerifCode = Joi.object({
  confirmationToken: Joi.string().trim().regex(/[0-9]/).required(),
});

const resetAdminPsw = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
});

export default {
  createUserAdmin: createAdminValidateSchema,
  putAdmin: updateAdminValidateSchema,
  updatePsw: updateAdminPswValidateSchema,
  adminById,
  loginAdmin,
  adminToken,
  adminCredential,
  adminVerifCode,
  resetAdminPsw,
};
