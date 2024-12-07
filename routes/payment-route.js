import { Router } from "express"
import paymentController from "../controllers/payment-controller.js"


const router = Router()

router.post('/momo', paymentController.createPaymentLink)
router.post('/result', paymentController.handleDataFromMomoService)
router.get('/status/:id', paymentController.checkStatusPayment)
router.patch('/balance', paymentController.updateBalance)
router.get('/combo', paymentController.loadComboData)

export default router
