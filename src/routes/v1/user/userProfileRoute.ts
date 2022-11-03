import { Router } from "express";
import { protect } from "../../../controllers/v1/authController";
import {
  getMe,
  updateUser,
  updatePassword,
  getUserProfile,
  removeAvatar,
} from "../../../controllers/v1/userController";
import SchemaValidator from "../../../middleware/SchemaValidator";
import uploadPhoto from "../../../middleware/uploadMedia";
import userSchema from "../validationSchema/userSchema";

const router = Router();
router.use(protect);

router.route("/me").get(getUserProfile);

router
  .route("/update")
  .put(
    uploadPhoto("users", "avatar"),
    getMe,
    SchemaValidator(userSchema.putUser),
    updateUser
  );
router
  .route("/change-password")
  .put(SchemaValidator(userSchema.updatePsw), updatePassword);
router.route("/remove-avatar").get(removeAvatar);
export default router;
