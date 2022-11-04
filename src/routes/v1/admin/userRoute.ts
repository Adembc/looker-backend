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
import { idSchema } from "../validationSchema/commonSchema";
import userSchema from "../validationSchema/userSchema";

const router = Router();

router.use(protect);

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
  .get(SchemaValidator(idSchema, ValidationSource.PARAM), getUser)
  .put(
    uploadMedia("users", "avatar"),
    SchemaValidator(idSchema, ValidationSource.PARAM),
    SchemaValidator(userSchema.putUser),
    updateUser
  )
  .delete(SchemaValidator(idSchema, ValidationSource.PARAM), deleteUser);
export default router;
