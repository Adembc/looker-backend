import Joi from "joi";
import {
  checkValidPhone,
  JoiObjectId,
} from "../../../middleware/SchemaValidator";

const createUserValidateSchema = Joi.object({
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
  email: Joi.string().email(),
  phone: checkValidPhone(),
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
})
  .with("password", "passwordConfirm")
  .xor("phone", "email");

const registerUserValidateSchema = Joi.object({
  email: Joi.string().email(),
  phone: checkValidPhone(),
  deviceId: Joi.string(),
}).xor("phone", "email");

const signup = Joi.object({
  email: Joi.string().email(),
  phone: checkValidPhone(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
  firstName: Joi.string().required().trim().min(3),
  lastName: Joi.string().required().trim().min(3),
})
  .xor("phone", "email")
  .with("password", "passwordConfirm")
  .with("phone", "countryCode");

const updateUserValidateSchema = Joi.object({
  email: Joi.string().email(),
  phone: checkValidPhone(),
  firstName: Joi.string().trim().min(3),
  lastName: Joi.string().trim().min(3),
});

const updateUserPswValidateSchema = Joi.object({
  currentPassword: Joi.string().required(),
  password: Joi.string().required().min(8),
  passwordConfirm: Joi.ref("password"),
});

const loginUser = Joi.object({
  email: Joi.string().email(),
  phone: checkValidPhone(),
  password: Joi.string().required().min(8),
  deviceId: Joi.string(),
}).xor("phone", "email");

const userToken = Joi.object({
  refreshToken: Joi.string().required(),
});

const userCredentialCheck = Joi.object({
  email: Joi.string().email(),
  phone: checkValidPhone(),
  countryCode: JoiObjectId(),
})
  .xor("phone", "email")
  .with("phone", "countryCode");
const userCredential = Joi.object({
  email: Joi.string().email(),
  phone: checkValidPhone(),
}).xor("phone", "email");

const userVerifCode = Joi.object({
  confirmationToken: Joi.string().trim().regex(/[0-9]/).required(),
});

const resetUserPsw = Joi.object({
  email: Joi.string().email(),
  phone: checkValidPhone(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
})
  .xor("phone", "email")
  .with("password", "passwordConfirm");

const completeUser = Joi.object({
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
  firstName: Joi.string().required().trim().min(3),
  lastName: Joi.string().required().trim().min(3),
  country: Joi.string().required(),
  learningDuration: Joi.number().greater(0).required(),
}).with("password", "passwordConfirm");

export default {
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
