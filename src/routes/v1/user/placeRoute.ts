import { Router } from "express";
import { protect } from "../../../controllers/v1/authController";
import { getCategories } from "../../../controllers/v1/categoryController";
import { suggestPlace } from "../../../controllers/v1/placeController";

const router = Router();
router.use(protect);

router.route("/suggest").post(suggestPlace);
export default router;
