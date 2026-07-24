import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/login", authRateLimiter, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/set-password", authRateLimiter, authController.setPassword);
router.patch("/change-password", requireAuth, authController.changePassword);

export default router;
