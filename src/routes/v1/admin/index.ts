import adminAuthRoute from "./authAdminRoute";
import userAdminRoute from "./userRoute";
import adminRoute from "./adminRoute";
import adminProfileRoute from "./adminProfileRoute";
import productRoute from "./productRoute";
import categoryRoute from "./categoryRoute";

import { Router } from "express";

const router = Router();

router.use("/admin/auth", adminAuthRoute);
router.use("/admin/users", userAdminRoute);
router.use("/admin/admins", adminRoute);
router.use("/admin/products", productRoute);
router.use("/admin/categories", categoryRoute);
router.use("/admin/", adminProfileRoute);

export default router;
