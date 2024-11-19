import { Router } from "express"
import orderController from '../controllers/order-controller.js'

const router = Router()

router.get('/', (req, res) => orderController.test(res))

export default router

