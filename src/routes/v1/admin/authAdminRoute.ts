import { Router } from "express";
import {
  login,
  refreshToken,
  logout,
} from "../../../controllers/v1/authAdminController";
import SchemaValidator from "../../../middleware/SchemaValidator";
import adminSchema from "../validationSchema/adminSchema";

const router = Router();
router.route("/login").post(SchemaValidator(adminSchema.loginAdmin), login);
router
  .route("/refresh")
  .post(SchemaValidator(adminSchema.adminToken), refreshToken);
router.route("/logout").post(SchemaValidator(adminSchema.adminToken), logout);

export default router;
