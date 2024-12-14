import { paymentService } from '../services/log-payment-service.js';

export const getBalance = async (req, res) => {
    const { customerId } = req.params;
    console.log(customerId)
    try {
        const balance = await paymentService.getBalanceService(customerId);
        res.status(200).send(balance);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};  

export const getRecentTransition = async (req, res) => {
    const { customerId } = req.params;
    try {
        const recentTransition = await paymentService.getRecentTransitionService(customerId);
        res.status(200).send(recentTransition);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const getPaymentHistory = async (req, res) => {
    const { customerId } = req.params;
    try {
        const paymentHistory = await paymentService.getPaymentHistoryService(customerId);
        res.status(200).send(paymentHistory);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const getTransactionAll = async (req, res) => {
    try {
        const balanceAll = await paymentService.getTransactionAllService();
        res.status(200).send(balanceAll);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const getTransactionPagination = async (req, res) => {
    const { page, limit } = req.query
    try {
        const balanceAll = await paymentService.getTransactionPaginationService(page, limit);
        res.status(200).send(balanceAll);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const getTransactionCount = async (req, res) => {
    try {
        const balanceAll = await paymentService.getTransactionCountService();
        res.status(200).send(balanceAll);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}