import { Router } from "express";
import multer from "multer";

import { orderController } from "../controllers/index.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// router.get('/upload', (req, res) => orderController.test(res))
router.post("/upload", upload.single("file"), (req, res) =>
  orderController.uploadFileToMinio(req, res)
);
router.post("/", (req, res) => {
  orderController.addOrder(req, res);
});
router.get("/:printerID", (req, res) => {
  orderController.getOrder(req, res);
});

export default router;
