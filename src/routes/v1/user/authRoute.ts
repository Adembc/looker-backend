import { Router } from "express";
import {
  login,
  check,
  refreshToken,
  logout,
  register,
} from "../../../controllers/v1/authController";
import SchemaValidator, {
  ValidationSource,
} from "../../../middleware/SchemaValidator";
import userSchema from "../validationSchema/userSchema";
import uploadPhoto from "../../../middleware/uploadMedia";
import { protect } from "../../../controllers/v1/authController";

const router = Router();

router
  .route("/signup")
  .post(
    uploadPhoto("users", "avatar"),
    SchemaValidator(userSchema.signup),
    register
  );
router
  .route("/check")
  .post(SchemaValidator(userSchema.userCredentialCheck), check);
router.route("/login").post(SchemaValidator(userSchema.loginUser), login);
router
  .route("/refresh")
  .post(SchemaValidator(userSchema.userToken), refreshToken);
router.route("/logout").post(SchemaValidator(userSchema.userToken), logout);

export default router;
