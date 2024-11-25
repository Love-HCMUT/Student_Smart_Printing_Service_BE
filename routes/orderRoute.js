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
router.put("/status", orderController.updateOrderStatus);
router.put("/completed", orderController.updateOrderCompleteTime);
router.put("/staff", orderController.updateOrderStaffID);
router.get("/:printerID", orderController.getOrderByPrinterID);

export default router;
