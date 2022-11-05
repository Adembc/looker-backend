import { Router } from "express";
import { protect } from "../../../controllers/v1/authController";
import {
  createPlace,
  getPlaces,
  onlyAccepted,
} from "../../../controllers/v1/placeController";
import SchemaValidator from "../../../middleware/SchemaValidator";
import uploadMedia from "../../../middleware/uploadMedia";
import { createPlaceSchema } from "../validationSchema/placeSchema";

const router = Router();
router.use(protect);

router
  .route("/")
  .get(onlyAccepted, getPlaces)
  .post(uploadMedia("slides"), SchemaValidator(createPlaceSchema), createPlace);
export default router;
