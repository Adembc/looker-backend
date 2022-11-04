import { Router } from "express";
import { protect } from "../../../controllers/v1/authAdminController";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../controllers/v1/categoryController";
import SchemaValidator, {
  ValidationSource,
} from "../../../middleware/SchemaValidator";
import uploadMedia from "../../../middleware/uploadMedia";
import { idSchema } from "../validationSchema/commonSchema";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validationSchema/categorySchema";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getCategories)
  .post(
    uploadMedia("categories", "img"),
    SchemaValidator(createCategorySchema),
    createCategory
  );

router
  .route("/:id")
  .put(
    uploadMedia("categories", "img"),
    SchemaValidator(idSchema, ValidationSource.PARAM),
    SchemaValidator(updateCategorySchema),
    updateCategory
  )
  .delete(SchemaValidator(idSchema, ValidationSource.PARAM), deleteCategory);
export default router;
