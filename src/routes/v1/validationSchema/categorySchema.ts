import Joi from "joi";
import { JoiObjectId } from "../../../middleware/SchemaValidator";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(1).required(),
  products: Joi.array().items(JoiObjectId()).min(1).required(),
}).min(1);

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(1),
  products: Joi.array().items(JoiObjectId()).min(1),
}).min(1);
