// MAIN ROUTER

import { Router } from "express";
import orderRouter from './log-order-route.js'
import makePaymentRouter from './log-payment-route.js'
import statisticRouter from './statistic-route.js'

const router = Router()

router.use('/order', orderRouter)
router.use('/payment', makePaymentRouter)
router.use('/statistic', statisticRouter)
export default router