import { Router } from "express";
import multer from "multer";

import orderController from "../controllers/order-controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// router.get('/upload', (req, res) => orderController.test(res))
router.post("/upload", upload.single("file"), (req, res) =>
  orderController.uploadFileToMinio(req, res)
);

export default router;
