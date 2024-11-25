import { Router } from "express";
import multer from "multer";

import { orderController } from "../controllers/index.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  upload.single("file"),
  orderController.uploadFileToMinio
);
router.post("/:printerID", orderController.addOrder);
router.put("/:id/:status", orderController.updateOrderStatus);
router.get("/:printerID", orderController.getOrderByPrinterID);

export default router;
