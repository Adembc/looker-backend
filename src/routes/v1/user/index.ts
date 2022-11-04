import authRoute from "./authRoute";
import categoryRoute from "./categoryRoute";
import placeRoute from "./placeRoute";
import userProfileRoute from "./userProfileRoute";

import { Router } from "express";

const router = Router();

router.use("/auth", authRoute);
router.use("/user/categories", categoryRoute);
router.use("/user/places", placeRoute);
router.use("/user", userProfileRoute);

export default router;
