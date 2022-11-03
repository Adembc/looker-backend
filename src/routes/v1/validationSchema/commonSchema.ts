import Joi from "joi";
import { JoiObjectId } from "../../../middleware/SchemaValidator";

export const idSchema = Joi.object({
  id: JoiObjectId().required(),
});
