import { Router } from "express";
import { protect } from "../../../controllers/v1/authController";

const router = Router();
router.use(protect);

router.route("/:place").get().post().put().delete();

export default router;
