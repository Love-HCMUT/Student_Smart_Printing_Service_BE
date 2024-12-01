// MAIN ROUTER

import { Router } from "express";
import orderRouter from "./orderRoute.js";
import printingRoute from "./printingRoute.js";
const router = Router();

router.use("/order", orderRouter);
router.use("/printing", printingRoute);

export default router;
