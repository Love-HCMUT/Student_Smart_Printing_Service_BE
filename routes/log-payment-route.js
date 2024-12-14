import { Router } from "express";
import { getBalance, getRecentTransition, getPaymentHistory, getTransactionAll, getTransactionPagination, getTransactionCount } from "../controllers/log-payment-controller.js"; // Import các hàm controller một cách chính xác
import { isAuthenticated, hasRole } from "../middlewares/auth.js";
const router = Router();

// router.get('/get-balance/:customerId', hasRole('User'), getBalance);
// router.get('/get-recent-transition/:customerId', hasRole('User'), getRecentTransition);
// router.get('/get-payment-history/:customerId', hasRole('User'), getPaymentHistory);
// router.get("/spso/get-transaction-pagination", hasRole('SPSO'), getTransactionPagination)
// router.get("/spso/get-transaction-count", hasRole('SPSO'), getTransactionCount)
// router.post('/spso/get-transaction/all', hasRole('SPSO'), getTransactionAll);



router.get('/get-balance/:customerId', getBalance);
router.get('/get-recent-transition/:customerId', getRecentTransition);
router.get('/get-payment-history/:customerId', getPaymentHistory);
router.get("/spso/get-transaction-pagination", getTransactionPagination)
router.get("/spso/get-transaction-count", getTransactionCount)
router.post('/spso/get-transaction/all', getTransactionAll);


export default router;