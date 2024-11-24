import { historyRepository } from "../models/order-repository.js";

export class historyService {
    static getOrderHistoryService = async (customerId) => {
        return await historyRepository.getOrderHistoryFromDB(customerId);
    };

    static cancelOrderService = async (orderId, note) => {
        return await historyRepository.cancelOrderFromDB(orderId, note);
    };

    static getOrderAllService = async (customerId) => {
        return await historyRepository.getOrderAllFromDB(customerId);
    };
}