// MAIN ROUTER

import { Router } from "express";
import orderRouter from "./orderRoute.js";

const router = Router();

router.use("/order", orderRouter);

export default router;
