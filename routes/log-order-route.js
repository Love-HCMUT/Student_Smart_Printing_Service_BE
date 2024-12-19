import { Router } from "express"
import {
    getOrderHistory, cancelOrder, getOrderAll,
    getOrderPagination, getOrderCount
} from '../controllers/log-order-controller.js'

const router = Router()
import { isAuthenticated, hasRole } from "../middlewares/auth.js";

router.get("/order-history/:customerId", getOrderHistory)
router.post("/cancel-order/:orderId", cancelOrder)
router.get("/spso/get-all-orders", getOrderAll)
router.get("/spso/get-all-orders-pagination", getOrderPagination)
router.get("/spso/get-order-count", getOrderCount)

export default router
