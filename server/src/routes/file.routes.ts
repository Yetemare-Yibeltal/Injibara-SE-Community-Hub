import { Router } from "express";
import * as fileController from "../controllers/file.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { attachBatchAccess } from "../middlewares/batchAccess.middleware";
import { uploadSingleFile } from "../middlewares/upload.middleware";

const router = Router();

router.use(requireAuth, attachBatchAccess);

router.post("/upload", uploadSingleFile, fileController.uploadFile);
router.get("/", fileController.listFiles);
router.delete("/:id", fileController.deleteFile);

export default router;
