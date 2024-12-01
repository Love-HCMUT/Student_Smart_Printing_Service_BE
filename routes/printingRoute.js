import { Router } from "express";

import { orderController } from "../controllers/index.js";
import { minioService } from "../services/index.js";

const router = Router();

router.get("/:staffID", orderController.getPrinterAndOrder);
router.get("/:orderID/details/:staffID", orderController.acceptOrder);
router.get(
  "/printFile/:fileName/:orderID/:logNumber/:fileID",
  orderController.printFile
);
router.post("/decline", orderController.declineOrder);

export default router;
