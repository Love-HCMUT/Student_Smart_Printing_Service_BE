import { paymentRepository } from "../models/log-payment-repository.js";
import redis from '../config/redis-dbs.js';
export class paymentService {

    static getBalanceService = async (customerId) => {
        try {
            const balance = await paymentRepository.getCustomerBalance(customerId);
            return { balance }
        } catch (error) {
            throw new Error('Error fetching balance');
        }
    };

    static getRecentTransitionService = async (customerId) => {
        try {
            const recentTransition = await paymentRepository.getRecentTransitionFromDB(customerId);
            return recentTransition ? recentTransition : [];
        } catch (error) {
            throw new Error('Error fetching recent transition');
        }
    };

    static getPaymentHistoryService = async (customerId) => {
        try {
            const paymentHistory = await paymentRepository.getPaymentHistoryFromDB(customerId);
            return paymentHistory.length ? paymentHistory : [];
        } catch (error) {
            throw new Error('Error fetching payment history');
        }
    };

    static getTransactionAllService = async () => {
        try {
            const key = `transaction-all`;
            const cache = await redis.get(key);
            if (cache) {
                return JSON.parse(cache);
            }

            const balanceAll = await paymentRepository.getTransactionAllFromDB();

            if (balanceAll) {
                await redis.set(key, JSON.stringify(balanceAll));
                redis.expire(key, 60 * 10)
            }
            return balanceAll;
        } catch (error) {
            throw new Error('Error fetching balance');
        }
    }

    static getTransactionPaginationService = async (page, limit) => {
        try {
            const key = `transaction-pagination-${page}-${limit}`;
            const cache = await redis.get(key)
            if (cache) {
                return JSON.parse(cache)
            }

            const balanceAll = await paymentRepository.getTransactionPaginationFromDB(page, limit)

            if (balanceAll) {
                await redis.set(key, JSON.stringify(balanceAll));
                redis.expire(key, 60 * 10);
            }
            return balanceAll;
        }
        catch (error) {
            throw new Error('Error fetching balance');
        }
    }



    static getTransactionCountService = async () => {
        try {
            const key = `transaction-count`;
            const cache = await redis.get(key);
            if (cache) {
                return JSON.parse(cache);
            }

            const balanceAll = await paymentRepository.getTransactionCountFromDB()
            if (balanceAll) {
                await redis.set(key, JSON.stringify(balanceAll));
                redis.expire(key, 60 * 10);
            }
            return balanceAll;
        } catch (error) {
            throw new Error('Error fetching balance');
        }
    }

    static getTransactionAllService = async () => {
        try {
            // const balanceAll = await paymentRepository.getTransactionAllFromDB();
            // return balanceAll;
            return [];
        } catch (error) {
            throw new Error("Error fetching balance");
        }
    }


    static getTransactionPaginationService = async (page, limit) => {
        try {
            const key = `transaction-pagination-${page}-${limit}`;
            const cache = await redis.get(key);
            if (cache) {
                return JSON.parse(cache);
            }
            const balanceAll = await paymentRepository.getTransactionPaginationFromDB(
                page,
                limit
            );
            if (balanceAll) {
                await redis.set(key, JSON.stringify(balanceAll));
                redis.expire(key, 60 * 10);
            }
            return balanceAll;
        } catch (error) {
            throw new Error(error);
        }
    }

    static getTransactionCountService = async () => {
        try {
            const balanceAll = await paymentRepository.getTransactionCountFromDB();
            return balanceAll;
        } catch (error) {
            throw new Error("Error fetching balance");
        }

    }

    static getTransactionSearchService = async (search, userID) => {
        try {
            const balanceAll = await paymentRepository.getTransactionSearchFromDB(search, userID);
            return balanceAll;
        } catch (error) {
            throw new Error("Error fetching balance");
        }
    }
}
