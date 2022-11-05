import { Router } from "express";
import { protect } from "../../../controllers/v1/authController";
import {
  createPlace,
  getUserPlaces,
} from "../../../controllers/v1/placeController";
import { updateProductState } from "../../../controllers/v1/productController";
import SchemaValidator from "../../../middleware/SchemaValidator";
import uploadMedia from "../../../middleware/uploadMedia";
import {
  createPlaceSchema,
  productPlace,
} from "../validationSchema/placeSchema";

const router = Router();
router.use(protect);

router.route("/update").put(SchemaValidator(productPlace), updateProductState);

router
  .route("/")
  .get(getUserPlaces)
  .post(uploadMedia("slides"), SchemaValidator(createPlaceSchema), createPlace);

export default router;
