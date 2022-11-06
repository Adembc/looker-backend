import { Router } from "express";
import { protect } from "../../../controllers/v1/authController";
import {
  deleteReview,
  getReviews,
  reviewPlace,
  updateReview,
} from "../../../controllers/v1/reviewController";
import SchemaValidator, {
  ValidationSource,
} from "../../../middleware/SchemaValidator";
import {
  addReview,
  placeId,
  updateReviewSchema,
} from "../validationSchema/reviewSchema";

const router = Router();
router.use(protect);

router
  .route("/:place")
  .get(SchemaValidator(placeId, ValidationSource.PARAM), getReviews)
  .post(
    SchemaValidator(placeId, ValidationSource.PARAM),
    SchemaValidator(addReview),
    reviewPlace
  )
  .put(
    SchemaValidator(placeId, ValidationSource.PARAM),
    SchemaValidator(updateReviewSchema),
    updateReview
  )
  .delete(SchemaValidator(placeId, ValidationSource.PARAM), deleteReview);

export default router;
