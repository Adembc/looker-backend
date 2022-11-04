import { Router } from "express";
import { protect } from "../../../controllers/v1/authAdminController";
import {
  getPlaces,
  createPlace,
  deletePlace,
  updatePlace,
} from "../../../controllers/v1/placeController";
import SchemaValidator, {
  ValidationSource,
} from "../../../middleware/SchemaValidator";
import uploadMedia from "../../../middleware/uploadMedia";
import { idSchema } from "../validationSchema/commonSchema";
import {
  createPlaceSchema,
  updatePlaceSchema,
} from "../validationSchema/placeSchema";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getPlaces)
  .post(uploadMedia("places"), SchemaValidator(createPlaceSchema), createPlace);

router
  .route("/:id")
  .put(
    uploadMedia("places"),
    SchemaValidator(idSchema, ValidationSource.PARAM),
    SchemaValidator(updatePlaceSchema),
    updatePlace
  )
  .delete(SchemaValidator(idSchema, ValidationSource.PARAM), deletePlace);
export default router;
