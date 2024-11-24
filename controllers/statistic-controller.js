import { statisticService } from '../services/statistic-service.js';


export const getRecentlyMonthlyOrder = async (req, res) => {
    try {
        res.status(200).send(await statisticService.getRecentlyMonthlyOrderService());
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};


export const getCurrentMonthlyOrder = async (req, res) => {
    const { month, year } = req.query;
    try {
        res.status(200).send(await statisticService.getCurrentMonthlyOrderService(month, year));
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