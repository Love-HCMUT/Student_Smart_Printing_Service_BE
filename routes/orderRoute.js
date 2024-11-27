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
router.post(
  "/addPackagePrintingPages",
  orderController.addPackagePrintingPages
);
router.post("/file", orderController.addFileMetadata);
router.post("/addOrder/:printerID", orderController.addOrder);
router.post("/package", orderController.addPackage);
router.put("/status", orderController.updateOrderStatus);
router.put("/completed", orderController.updateOrderCompleteTime);
router.put("/staff", orderController.updateOrderStaffID);
router.get("/fileMetadata", orderController.getFileMetadataByPackageID);
router.get("/package", orderController.getPackageByOrderID);
router.get(
  "/packagePrintingPages",
  orderController.getPackagePrintingPagesByPackageID
);
router.get("/:printerID", orderController.getOrderByPrinterID);

export default router;
