import Joi from "joi";
import { SUGGEST_TYPE } from "../../../database/model/suggestModel";
import { JoiObjectId } from "../../../middleware/SchemaValidator";
import {
  createPlaceSchema,
  updatePlaceSchema,
} from "../validationSchema/placeSchema";
import { updateProductSchema } from "../validationSchema/productSchema";

export const suggestEditSchema = Joi.object({
  type: Joi.string()
    .valid(SUGGEST_TYPE.CATEGORY, SUGGEST_TYPE.PLACE, SUGGEST_TYPE.PRODUCT)
    .required(),
  data: Joi.when("type", {
    is: SUGGEST_TYPE.PLACE,
    then: updatePlaceSchema.append({ id: JoiObjectId().required() }),
  })
    .when("type", {
      is: SUGGEST_TYPE.PRODUCT,
      then: updateProductSchema.append({ id: JoiObjectId().required() }),
    })
    .when("type", {
      is: SUGGEST_TYPE.CATEGORY,
      then: updateProductSchema.append({ id: JoiObjectId().required() }),
    }),
});
