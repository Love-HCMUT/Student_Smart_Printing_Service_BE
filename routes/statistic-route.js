import { Router } from "express";
import {
    getRecentlyMonthlyOrder, getCurrentMonthlyStatictis, getCurrentYearlyStatictis
} from '../controllers/statistic-controller.js';
import { isAuthenticated, hasRole } from "../middlewares/auth.js";
const router = Router();

router.post('/spso/get-recently-monthly-order', hasRole('SPSO'), getRecentlyMonthlyOrder);
router.get('/spso/get-current-monthly-order/:month/:year', hasRole('SPSO'), getCurrentMonthlyStatictis)
router.get('/spso/get-current-yearly-order/:year', hasRole('SPSO'), getCurrentYearlyStatictis)

export default router;