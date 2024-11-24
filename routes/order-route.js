import { Router } from "express"
import { getOrderHistory, cancelOrder, getOrderAll } from '../controllers/order-controller.js'

const router = Router()

router.get("/order-history/:customerId", getOrderHistory)
router.post("/cancel-order/:orderId", cancelOrder)


router.get("/spso/get-all-orders", getOrderAll)
export default router

