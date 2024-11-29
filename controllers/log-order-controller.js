import { historyService } from "../services/log-order-service.js";

export const getOrderHistory = async (req, res) => {
    const { customerId } = req.params;
    try {
        res.status(200).send(await historyService.getOrderHistoryService(customerId));
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    const { note } = req.body;
    try {
        res.status(200).send(await historyService.cancelOrderService(orderId, note))
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getOrderAll = async (req, res) => {
    const { customerId } = req.params;
    try {
        res.status(200).send(await historyService.getOrderAllService(customerId));
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const getOrderPagination = async (req, res) => {
    const { page, limit } = req.query
    try {
        res.status(200).send(await historyService.getOrderPaginationService(page, limit));
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const getOrderCount = async (req, res) => {
    try {
        res.status(200).send(await historyService.getOrderCountService());
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}