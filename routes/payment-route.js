import { Router } from "express"
import paymentController from "../controllers/payment-controller.js"

const router = Router()

router.post('/momo', paymentController.createPaymentLink)
router.post('/result', paymentController.handleDataFromMomoService)

export default router

