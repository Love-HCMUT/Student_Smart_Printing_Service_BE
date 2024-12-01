import { Router } from "express";

import { orderController } from "../controllers/index.js";
import { minioService } from "../services/index.js";

const router = Router();

router.get("/:staffID", orderController.getPrinterAndOrder);
router.get("/:orderID/details", orderController.getOrderDetails);
router.get("/minioFile/:fileName", minioService.getFileFromMinio);

export default router;
