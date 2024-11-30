import { Router } from "express";
import multer from "multer";

import { orderController } from "../controllers/index.js";
import { minioService, orderService } from "../services/index.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", upload.any(), orderController.createOrder);
router.get("/minioFile/:fileName", minioService.getFileFromMinio);
router.get(
  "/printers/:colorPrinting/:side",
  orderController.getAllActivePrinter
);
router.get("/:customerID", orderController.getCustomer);

export default router;
