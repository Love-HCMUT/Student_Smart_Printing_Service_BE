import { Router } from "express"
import {
    getOrderHistory, cancelOrder, getOrderAll,
    getOrderPagination, getOrderCount, searchOrder
} from '../controllers/log-order-controller.js'

const router = Router()
import { isAuthenticated, hasRole } from "../middlewares/auth.js";

router.get("/order-history/:customerId", getOrderHistory)
router.post("/cancel-order/:orderId", cancelOrder)
router.get("/spso/get-all-orders", hasRole('SPSO'), getOrderAll)
router.get("/spso/get-all-orders-pagination", hasRole('SPSO'), getOrderPagination)
router.get("/spso/get-order-count", hasRole('SPSO'), getOrderCount)

router.get("/search-order", hasRole('User'), searchOrder)

export default router
