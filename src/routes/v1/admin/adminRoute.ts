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

const router = Router();
// router.use(protect);
router
  .route("/")
  .get(getAdmins)
  .post(SchemaValidator(adminSchema.createUserAdmin), createAdmin);
router
  .route("/:id")
  .get(SchemaValidator(adminSchema.adminById, ValidationSource.PARAM), getAdmin)
  .put(
    SchemaValidator(adminSchema.adminById, ValidationSource.PARAM),
    SchemaValidator(adminSchema.putAdmin),
    updateAdmin
  )
  .delete(
    SchemaValidator(adminSchema.adminById, ValidationSource.PARAM),
    deleteAdmin
  );
export default router;
