// MAIN ROUTER

import { Router } from "express";
import paymentRouter from './payment-route.js'
import systemconfigRouter from './systemconfig-route.js'
import orderRouter from './log-order-route.js'
import makePaymentRouter from './log-payment-route.js'
import statisticRouter from './statistic-route.js'
import accountRouter from "./account-router.js";
import PrinterRouter from "./manage_printer.js"

const router = Router()

router.use('/order', orderRouter)
router.use('/payment', paymentRouter)
router.use('/systemconfig', systemconfigRouter)
router.use('/payment', makePaymentRouter)
router.use('/statistic', statisticRouter)
router.use("/api/account", accountRouter);
router.use("/api/printer", PrinterRouter);

export default router