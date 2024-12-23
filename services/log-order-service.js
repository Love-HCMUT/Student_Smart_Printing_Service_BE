import { historyRepository } from "../models/log-order-repository.js";
import redis from "../config/redis-dbs.js";

export class historyService {
    static getOrderHistoryService = async (customerId) => {
        try {
            const result = await historyRepository.getOrderHistoryFromDB(customerId)
            return result
        } catch (error) {
            console.error(error)
        }
    };

    static cancelOrderService = async (orderId, note) => {

        if (orderId === undefined || orderId === null || orderId === "") {
            throw new Error("orderId is required")
        } else if (isNaN(orderId)) {
            throw new Error("orderId must be a number")
        } else if (orderId < 0) {
            throw new Error("orderId must be a positive number")
        }
        return await historyRepository.cancelOrderFromDB(orderId, note);

    };

    static getOrderAllService = async () => {
        try {
            const result = await historyRepository.getOrderAllFromDB()
            return result
        } catch (error) {
            console.error(error)
        }
    };

    static getOrderPaginationService = async (page, limit) => {
        try {
            const key = `order-pagination-${page}-${limit}`
            const cache = await redis.get(key)
            if (cache) {
                return JSON.parse(cache)
            } else {
                const result = await historyRepository.getOrderPaginationFromDB(page, limit)
                await redis.set(key, JSON.stringify(result))
                redis.expire(key, 60 * 10)
                return result
            }
        } catch (error) {
            console.error(error)
        }
    }

    static getOrderCountService = async () => {
        try {
            const key = `order-count`
            const cache = await redis.get(key)
            if (cache) {
                return JSON.parse(cache)
            } else {
                const result = await historyRepository.getOrderCountFromDB()
                await redis.set(key, JSON.stringify(result))
                redis.expire(key, 60 * 10)
                return result
            }
        } catch (error) {
            console.error(error)
        }
    }

    static searchOrderService = async (customerId, search) => {
        try {
            const result = await historyRepository.searchOrderFromDB(customerId, search)
            return result
        } catch (error) {
            console.error(error)
        }
    }
}