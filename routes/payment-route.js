import { Router } from "express";
import { getBalance, getRecentTransition, getPaymentHistory, getTransactionAll, getTransactionPagination, getTransactionCount } from "../controllers/payment-controller.js"; // Import các hàm controller một cách chính xác

const router = Router();

router.get('/get-balance/:customerId', getBalance);
router.get('/get-recent-transition/:customerId', getRecentTransition);
router.get('/get-payment-history/:customerId', getPaymentHistory);
router.get("/spso/get-transaction-pagination", getTransactionPagination)
router.get("/spso/get-transaction-count", getTransactionCount)

router.post('/spso/get-transaction/all', getTransactionAll);
export default router;