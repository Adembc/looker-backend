import { Router } from "express";
import { protect } from "../../../controllers/v1/authController";
import { getCategories } from "../../../controllers/v1/categoryController";
import {
  getPlaces,
  suggestPlace,
} from "../../../controllers/v1/placeController";

const router = Router();
router.use(protect);

router.route("/").get(getPlaces);
export default router;
