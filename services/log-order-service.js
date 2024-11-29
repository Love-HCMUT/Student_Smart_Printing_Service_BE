import { historyRepository } from "../models/log-order-repository.js";
import redis from "../config/redis-dbs.js";

export class historyService {
    static getOrderHistoryService = async (customerId) => {
        try {
            const key = `order-history-${customerId}`;
            const cache = await redis.get(key)
            if (cache) {
                return JSON.parse(cache)
            } else {
                const result = await historyRepository.getOrderHistoryFromDB(customerId)
                await redis.set(key, JSON.stringify(result))
                return result
            }
        } catch (error) {
            console.error(error)
        }
    };

    static cancelOrderService = async (orderId, note) => {
        try {

            return await historyRepository.cancelOrderFromDB(orderId, note);
        } catch (error) {
            console.error(error)
        }
    };

    static getOrderAllService = async (customerId) => {
        try {
            const key = `order-all-${customerId}`
            const cache = await redis.get(key)
            if (cache) {
                return JSON.parse(cache)
            } else {
                const result = await historyRepository.getOrderAllFromDB(customerId)
                await redis.set(key, JSON.stringify(result))
                return result
            }
        } catch (error) {
            console.error(error)
        }
    };

    static getOrderPaginationService = async (page, limit) => {
        try {
            return await historyRepository.getOrderPaginationFromDB(page, limit)
        } catch (error) {
            console.error(error)
        }
    }

    static getOrderCountService = async () => {
        try {
            return await historyRepository.getOrderCountFromDB()
        } catch (error) {
            console.error(error)
        }
    }
}