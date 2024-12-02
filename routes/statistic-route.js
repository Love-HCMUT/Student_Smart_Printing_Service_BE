import { Router } from "express";
import {
    getRecentlyMonthlyOrder, getCurrentMonthlyStatictis, getCurrentYearlyStatictis
} from '../controllers/statistic-controller.js';

const router = Router();

router.post('/spso/get-recently-monthly-order', getRecentlyMonthlyOrder);
router.get('/spso/get-current-monthly-order/:month/:year', getCurrentMonthlyStatictis)
router.get('/spso/get-current-yearly-order/:year', getCurrentYearlyStatictis)

export default router;