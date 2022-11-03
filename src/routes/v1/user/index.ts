import authRoute from "./authRoute";
import userProfileRoute from "./userProfileRoute";

import { Router } from "express";

const router = Router();

router.use("/user", userProfileRoute);
router.use("/auth", authRoute);

export default router;
