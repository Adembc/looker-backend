import { Router } from "express";
import { protect } from "../../../controllers/v1/authController";
import { getCategories } from "../../../controllers/v1/categoryController";

const router = Router();
router.use(protect);

router.route("/").get(getCategories);
export default router;
