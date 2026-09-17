import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/me", userController.getMyProfile);
router.patch("/me/profile", userController.updateMyProfile);

export default router;
