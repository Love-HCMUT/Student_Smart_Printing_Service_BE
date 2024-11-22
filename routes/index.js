// MAIN ROUTER

import { Router } from "express";
import orderRouter from './order-route.js'
import paymentRouter from './payment-route.js'
import systemconfigRouter from './systemconfig-route.js'

const router = Router()

router.use('/order', orderRouter)
router.use('/payment', paymentRouter)
router.use('/systemconfig', systemconfigRouter)

export default router