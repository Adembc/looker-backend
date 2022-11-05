import { Router } from "express";
import { protect } from "../../../controllers/v1/authController";
import { suggestEdit } from "../../../controllers/v1/suggestController";
import SchemaValidator from "../../../middleware/SchemaValidator";
import uploadMedia from "../../../middleware/uploadMedia";
import { suggestEditSchema } from "./suggestSchema";

const router = Router();
router.use(protect);

router
  .route("/")
  .post(
    uploadMedia("suggest"),
    SchemaValidator(suggestEditSchema),
    suggestEdit
  );
export default router;
