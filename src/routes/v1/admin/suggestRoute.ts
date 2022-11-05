import { Router } from "express";
import { protect } from "../../../controllers/v1/authAdminController";
import {
  acceptSuggestion,
  deleteSuggestion,
  getSuggestions,
} from "../../../controllers/v1/suggestController";
import SchemaValidator, {
  ValidationSource,
} from "../../../middleware/SchemaValidator";
import { idSchema } from "../validationSchema/commonSchema";

const router = Router();

router.use(protect);

router.route("/").get(getSuggestions);
router
  .route("/:id")
  .post(SchemaValidator(idSchema, ValidationSource.PARAM), acceptSuggestion)
  .delete(SchemaValidator(idSchema, ValidationSource.PARAM), deleteSuggestion);
export default router;
