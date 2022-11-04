import { Router } from "express";
import { protect } from "../../../controllers/v1/authAdminController";
import {
  getAdmin,
  getAdmins,
  createAdmin,
  deleteAdmin,
  updateAdmin,
} from "../../../controllers/v1/adminController";
import adminSchema from "../validationSchema/adminSchema";
import SchemaValidator, {
  ValidationSource,
} from "../../../middleware/SchemaValidator";
import { idSchema } from "../validationSchema/commonSchema";

const router = Router();
router.use(protect);
router
  .route("/")
  .get(getAdmins)
  .post(SchemaValidator(adminSchema.createUserAdmin), createAdmin);
router
  .route("/:id")
  .get(SchemaValidator(idSchema, ValidationSource.PARAM), getAdmin)
  .put(
    SchemaValidator(idSchema, ValidationSource.PARAM),
    SchemaValidator(adminSchema.putAdmin),
    updateAdmin
  )
  .delete(SchemaValidator(idSchema, ValidationSource.PARAM), deleteAdmin);
export default router;
