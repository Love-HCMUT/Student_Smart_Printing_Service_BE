import redis from '../config/redis-dbs.js';
import { statisticRepository } from '../models/statistic-repository.js';

export class statisticService {
    static getRecentlyMonthlyOrderService = async () => {
        try {
            const keys = ['currentMonth', 'lastMonth', 'twoMonthsAgo'];

            const cacheVal = await redis.mget(keys)

            if (cacheVal[0] !== null && cacheVal[1] !== null && cacheVal[2] !== null)
                return [JSON.parse(cacheVal[0]), JSON.parse(cacheVal[1]), JSON.parse(cacheVal[2])]

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
            const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
            const twoMonthsAgo = currentMonth <= 2 ? 12 + (currentMonth - 2) : currentMonth - 2;
            const twoMonthsAgoYear = currentMonth <= 2 ? currentYear - 1 : currentYear;

            const currentMonthData = await statisticRepository.getRecentlyMonthlyOrderFromDB(currentMonth, currentYear);
            const lastMonthData = await statisticRepository.getRecentlyMonthlyOrderFromDB(lastMonth, lastMonthYear);
            const twoMonthsAgoData = await statisticRepository.getRecentlyMonthlyOrderFromDB(twoMonthsAgo, twoMonthsAgoYear);

            redis.mset(keys[0], JSON.stringify(currentMonthData),
                keys[1], JSON.stringify(lastMonthData),
                keys[2], JSON.stringify(twoMonthsAgoData))

            redis.expire(keys[0], 60 * 60 * 24)
            redis.expire(keys[1], 60 * 60 * 24)
            redis.expire(keys[2], 60 * 60 * 24)

            return [currentMonthData, lastMonthData, twoMonthsAgoData];
        } catch (error) {
            throw new Error('Internal Server Error');
        }
    };

    static getCurrentMonthlyOrderService = async (currentMonth, currentYear) => {
        try {
            const key = `current-monthly-order-${currentMonth}-${currentYear}`;
            const cache = await redis.get(key)
            if (cache) {
                return {
                    currentMonth: JSON.parse(cache)
                }
            }
            const currentMonthData = await statisticRepository.getRecentlyMonthlyOrderFromDB(currentMonth, currentYear);

            await redis.set(key, JSON.stringify(currentMonthData))
            redis.expire(key, 60 * 60)

            return {
                currentMonth: currentMonthData
            };

        } catch (error) {
            throw new Error('Internal Server Error');
        }
    };

    static getTotalCountService = async () => {
        try {
            const key = `total-count`;
            const cache = await redis.get(key)
            if (cache) {
                return JSON.parse(cache)
            }
            const totalOrder = await statisticRepository.getTotalOrderFromDB();
            const totalTransaction = await statisticRepository.getTotalTransactionFromDB();

            const totalUserCanceledOrder = await statisticRepository.getTotalUserCanceledOrderFromDB();
            const totalPSCanceledOrder = await statisticRepository.getTotalPSCanceledOrderFromDB();

            const totalCanceledOrder = totalUserCanceledOrder[0].totalCanceledOrder + totalPSCanceledOrder[0].totalCanceledOrder;

            const total = {
                totalOrder: totalOrder[0].totalOrder,
                totalTransaction: totalTransaction[0].totalTransaction,
                totalCanceledOrder: totalCanceledOrder
            };

            await redis.set(key, JSON.stringify(total))
            redis.expire(key, 60 * 60 * 24)

            return total;

        } catch (error) {
            throw new Error(error);
        }
    };

    static getNumberOfOrdersByMonthYearService = async () => {
        try {
            const key = `number-of-orders-by-month-year`;
            const cache = await redis.get(key);
            if (cache) {
                return JSON.parse(cache)
            }

            const data = await statisticRepository.getNumberOfOrdersByMonthYearFromDB();

            await redis.set(key, JSON.stringify(data))
            redis.expire(key, 60 * 60 * 24)

            return data;
        } catch (error) {
            throw new Error(error);
        }
    };

    static getNumberOfTransactionByMonthYearService = async () => {
        try {
            const key = `number-of-transaction-by-month-year`;
            const cache = await redis.get(key);
            if (cache) {
                return JSON.parse(cache)
            }
            const data = await statisticRepository.getNumberOfTransactionByMonthYearFromDB();
            redis.set(key, JSON.stringify(data))
            redis.expire(key, 60 * 60 * 24)
            return data;
        } catch (error) {
            throw new Error(error);
        }
    };
}