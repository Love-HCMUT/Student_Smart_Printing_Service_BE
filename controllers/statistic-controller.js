import { statisticService } from '../services/statistic-service.js';


export const getRecentlyMonthlyOrder = async (req, res) => {

    try {
        const listCurrentMonth = await statisticService.getRecentlyMonthlyOrderService();
        const monthYear = await statisticService.getNumberOfOrdersByMonthYearService();
        res.status(200).send({
            listCurrentMonth: listCurrentMonth,
            monthYear: monthYear
        });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const getCurrentMonthlyStatictis = async (req, res) => {
    const { month, year } = req.params;

    try {
        res.status(200).send(await statisticService.getMonthlyOrderService(month, year));
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const getCurrentYearlyStatictis = async (req, res) => {
    const { year } = req.params;
    try {
        res.status(200).send(await statisticService.getCurrentYearlyStatictisService(year));
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}