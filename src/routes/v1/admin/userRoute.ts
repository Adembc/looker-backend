import { Router } from "express";
import { protect } from "../../../controllers/v1/authAdminController";
import {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../../../controllers/v1/userController";
import SchemaValidator, {
  ValidationSource,
} from "../../../middleware/SchemaValidator";
import uploadMedia from "../../../middleware/uploadMedia";
import userSchema from "../validationSchema/userSchema";

const router = Router();

// router.use(protect);

router
  .route("/")
  .get(getUsers)
  .post(
    uploadMedia("users", "avatar"),
    SchemaValidator(userSchema.createUserAdmin, ValidationSource.BODY, {
      verified: true,
      verifTry: undefined,
      completed: true,
    }),
    createUser
  );

router
  .route("/:id")
  .get(SchemaValidator(userSchema.userById, ValidationSource.PARAM), getUser)
  .put(
    uploadMedia("users", "avatar"),
    SchemaValidator(userSchema.userById, ValidationSource.PARAM),
    SchemaValidator(userSchema.putUser),
    updateUser
  )
  .delete(
    SchemaValidator(userSchema.userById, ValidationSource.PARAM),
    deleteUser
  );
export default router;
