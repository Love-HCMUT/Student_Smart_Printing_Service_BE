import { historyService } from "../services/order-service.js";

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