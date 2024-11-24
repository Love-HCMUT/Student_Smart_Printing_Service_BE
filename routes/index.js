// MAIN ROUTER

import { Router } from "express";
import orderRouter from './order-route.js'
import makePaymentRouter from './payment-route.js'

const router = Router()

router.use('/order', orderRouter)
router.use('/payment', makePaymentRouter)

export default router