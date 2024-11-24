import { Router } from "express";
import {
    getRecentlyMonthlyOrder, getCurrentMonthlyOrder,
    getTotalCount, getNumberOfOrdersByMonthYear, getNumberOfTransactionByMonthYear
} from '../controllers/statistic-controller.js';

const router = Router();

router.post('/spso/get-recently-monthly-order', getRecentlyMonthlyOrder);
router.get('spso/get-current-monthly-order/:month/:year', getCurrentMonthlyOrder)


router.post('/spso/get-total-count', getTotalCount);

router.post('/spso/get-number-of-orders-by-month-year', getNumberOfOrdersByMonthYear);
router.post('/spso/get-number-of-transaction-by-month-year', getNumberOfTransactionByMonthYear);
export default router;