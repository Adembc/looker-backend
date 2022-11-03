import { Router } from "express";
import { protect } from "../../../controllers/v1/authAdminController";
import {
  getAdmin,
  updateAdmin,
  getMe,
  updatePassword,
} from "../../../controllers/v1/adminController";
import adminSchema from "../validationSchema/adminSchema";
import SchemaValidator from "../../../middleware/SchemaValidator";

const router = Router();
router.use(protect);

router.route("/me").get(getMe, getAdmin);
router
  .route("/update")
  .put(getMe, SchemaValidator(adminSchema.putAdmin), updateAdmin);
router
  .route("/change-password")
  .put(SchemaValidator(adminSchema.updatePsw), updatePassword);
export default router;
