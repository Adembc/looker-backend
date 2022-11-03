import { Router } from "express";
import { protect } from "../../../controllers/v1/authAdminController";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../../controllers/v1/productController";
import SchemaValidator, {
  ValidationSource,
} from "../../../middleware/SchemaValidator";
import uploadMedia from "../../../middleware/uploadMedia";
import userSchema from "../validationSchema/userSchema";

const router = Router();

// router.use(protect);

router
  .route("/")
  .get(getProducts)
  .post(uploadMedia("products", "img"), createProduct);

router
  .route("/:id")
  .put(
    uploadMedia("products", "img"),
    SchemaValidator(userSchema.userById, ValidationSource.PARAM),
    updateProduct
  )
  .delete(
    SchemaValidator(userSchema.userById, ValidationSource.PARAM),
    deleteProduct
  );
export default router;
