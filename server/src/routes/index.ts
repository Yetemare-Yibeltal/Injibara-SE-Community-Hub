import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

// Health check route - confirms the API is alive and reachable
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Injibara SE Community API is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);

// Additional feature routes will be mounted here as they are built
// in later phases, for example:
// router.use('/users', userRoutes);

export default router;
 