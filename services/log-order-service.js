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
        try {
            return await historyRepository.cancelOrderFromDB(orderId, note);
        } catch (error) {
            console.error(error)
        }
    };

    static getOrderAllService = async (customerId) => {
        try {
            // const key = `order-all-${customerId}`
            // const cache = await redis.get(key)
            // if (cache) {
            //     return JSON.parse(cache)
            // } else {
            const result = await historyRepository.getOrderAllFromDB(customerId)
            // await redis.set(key, JSON.stringify(result))
            return result
            // }
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
                redis.expire(key, 60 * 30)
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
                redis.expire(key, 60 * 30)
                return result
            }
        } catch (error) {
            console.error(error)
        }
    }
}