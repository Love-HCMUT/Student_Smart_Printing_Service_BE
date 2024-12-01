// MAIN ROUTER

import { Router } from "express";
import paymentRouter from './payment-route.js'
import systemconfigRouter from './systemconfig-route.js'
import orderRouter from './log-order-route.js'
import makePaymentRouter from './log-payment-route.js'
import statisticRouter from './statistic-route.js'


const router = Router()

router.use('/logOrder', orderRouter)
router.use('/payment', paymentRouter)
router.use('/systemconfig', systemconfigRouter)
router.use('/logPayment', makePaymentRouter)
router.use('/statistic', statisticRouter)

export default router