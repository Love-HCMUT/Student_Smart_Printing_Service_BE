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

export const getTotalCount = async (req, res) => {
    try {
        res.status(200).send(await statisticService.getTotalCountService());
    } catch (error) {
        res.status(500).send({ error });
    }
}

export const getNumberOfOrdersByMonthYear = async (req, res) => {
    try {
        res.status(200).send(await statisticService.getNumberOfOrdersByMonthYearService());
    } catch (error) {
        res.status(500).send({ error });
    }
}

export const getNumberOfTransactionByMonthYear = async (req, res) => {
    try {
        res.status(200).send(await statisticService.getNumberOfTransactionByMonthYearService());
    } catch (error) {
        res.status(500).send({ error });
    }
}

export const getCurrentMonthlyStatictis = async (req, res) => {
    const { month, year } = req.params;

    try {
        res.status(200).send(await statisticService.getMonthlyOrderService(month, year));
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};