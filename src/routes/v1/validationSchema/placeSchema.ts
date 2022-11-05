import Joi from "joi";
import { JoiObjectId } from "../../../middleware/SchemaValidator";

export const createPlaceSchema = Joi.object({
  name: Joi.string().min(1).required(),
  lat: Joi.number().required(),
  lan: Joi.number().required(),
  category: JoiObjectId().required(),
}).min(1);

export const updatePlaceSchema = Joi.object({
  name: Joi.string().min(1),
  lat: Joi.number(),
  lan: Joi.number(),
  category: JoiObjectId(),
  slides: Joi.array().items(JoiObjectId()),
  status: Joi.number().min(1).max(3),
}).min(1);
export const productPlace = Joi.object({
  product: JoiObjectId().required(),
  place: JoiObjectId().required(),
  isAvailable: Joi.boolean(),
}).min(1);
