import Joi from "joi";
import { JoiObjectId } from "../../../middleware/SchemaValidator";

export const addReview = Joi.object({
  comment: Joi.string(),
  amount: Joi.number().min(1).max(5).required(),
}).min(1);
export const updateReviewSchema = Joi.object({
  comment: Joi.string(),
  amount: Joi.number().min(1).max(5),
}).min(1);

export const placeId = Joi.object({
  place: JoiObjectId().required(),
}).min(1);
