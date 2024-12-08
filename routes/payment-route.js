import { Router } from "express"
import paymentController from "../controllers/payment-controller.js"
import { validatePaymentRule, validationRequest, validateCheckStatusRule } from '../middlewares/payment.js'

const router = Router()

router.post('/momo', validatePaymentRule, validationRequest, paymentController.createPaymentLink)
router.post('/result', paymentController.handleDataFromMomoService)
router.get('/status/:id', validateCheckStatusRule, validationRequest, paymentController.checkStatusPayment)
router.get('/combo', paymentController.loadComboData)
// router.patch('/balance', paymentController.updateBalance)

export default router

