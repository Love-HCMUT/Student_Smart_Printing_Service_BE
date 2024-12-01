// MAIN ROUTER

import { Router } from "express";
import paymentRouter from "./payment-route.js";
import systemconfigRouter from "./systemconfig-route.js";
import logOrderRouter from "./log-order-route.js";
import makePaymentRouter from "./log-payment-route.js";
import statisticRouter from "./statistic-route.js";

import orderRouter from "./orderRoute.js";
import printingRoute from "./printingRoute.js";
const router = Router();

router.use("/order", orderRouter);
router.use("/printing", printingRoute);
router.use("/logOrder", logOrderRouter);
router.use("/payment", paymentRouter);
router.use("/systemconfig", systemconfigRouter);
router.use("/payment", makePaymentRouter);
router.use("/statistic", statisticRouter);

export default router;
