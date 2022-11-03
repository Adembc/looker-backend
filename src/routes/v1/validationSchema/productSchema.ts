import Joi from "joi";
import { JoiObjectId } from "../../../middleware/SchemaValidator";

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).required(),
}).min(1);

export const updateProductSchema = Joi.object({
  name: Joi.string().min(1),
}).min(1);
