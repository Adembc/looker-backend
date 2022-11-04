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
import { idSchema } from "../validationSchema/commonSchema";
import {
  createProductSchema,
  updateProductSchema,
} from "../validationSchema/productSchema";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getProducts)
  .post(
    uploadMedia("products", "img"),
    SchemaValidator(createProductSchema),
    createProduct
  );

router
  .route("/:id")
  .put(
    uploadMedia("products", "img"),
    SchemaValidator(idSchema, ValidationSource.PARAM),
    SchemaValidator(updateProductSchema),
    updateProduct
  )
  .delete(SchemaValidator(idSchema, ValidationSource.PARAM), deleteProduct);
export default router;
