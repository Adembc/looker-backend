import authRoute from "./authRoute";
import categoryRoute from "./categoryRoute";
import placeRoute from "./placeRoute";
import suggestRoute from "./suggestRoute";
import reviewRoute from "./reviewRoute";
import userProfileRoute from "./userProfileRoute";

import { Router } from "express";

const router = Router();

router.use("/auth", authRoute);
router.use("/user/categories", categoryRoute);
router.use("/user/places", placeRoute);
router.use("/user/suggestions", suggestRoute);
router.use("/user/reviews", reviewRoute);
router.use("/user", userProfileRoute);

export default router;
