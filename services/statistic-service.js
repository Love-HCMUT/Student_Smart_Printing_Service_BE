import redis from '../config/redis-dbs.js';
import { statisticRepository } from '../models/statistic-repository.js';

export class statisticService {
    static getRecentlyMonthlyOrderService = async () => {
        try {
            const keys = ['currentMonth', 'lastMonth', 'twoMonthsAgo'];
            const cacheVal = await redis.mget(keys);

            if (cacheVal.every(val => val !== null)) {
                return cacheVal.map(val => JSON.parse(val));
            }

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
            const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
            const twoMonthsAgo = currentMonth <= 2 ? 12 + (currentMonth - 2) : currentMonth - 2;
            const twoMonthsAgoYear = currentMonth <= 2 ? currentYear - 1 : currentYear;

            const [currentMonthData, lastMonthData, twoMonthsAgoData] = await Promise.all([
                statisticRepository.getRecentlyMonthlyOrderFromDB(currentMonth, currentYear),
                statisticRepository.getRecentlyMonthlyOrderFromDB(lastMonth, lastMonthYear),
                statisticRepository.getRecentlyMonthlyOrderFromDB(twoMonthsAgo, twoMonthsAgoYear)
            ]);

            await redis.mset(
                keys[0], JSON.stringify(currentMonthData),
                keys[1], JSON.stringify(lastMonthData),
                keys[2], JSON.stringify(twoMonthsAgoData)
            );

            keys.forEach(key => redis.expire(key, 60 * 60));

            return [currentMonthData, lastMonthData, twoMonthsAgoData];
        } catch (error) {
            throw new Error('Internal Server Error');
        }
    };

    static getMonthlyOrderService = async (currentMonth, currentYear) => {
        try {
            const key = `current-monthly-order-${currentMonth}-${currentYear}`;
            const cache = await redis.get(key);
            if (cache) {
                return JSON.parse(cache);
            }

            const [monthOrderData, monthTransactionData, getCountMonthOrderData, getCountTransactionData, getCountCancelData] = await Promise.all([
                statisticRepository.getRecentlyMonthlyOrderFromDB(currentMonth, currentYear),
                statisticRepository.getRecentlyMonthlyTransactionFromDB(currentMonth, currentYear),
                statisticRepository.getCountMonthOrderDataFromDB(currentMonth, currentYear),
                statisticRepository.getCountMonthTransactionrDataFromDB(currentMonth, currentYear),
                statisticRepository.getTotalCancelOrderFromDB(currentMonth, currentYear)
            ]);

            const currentMonthData = {
                order: monthOrderData,
                transaction: monthTransactionData,
                countOrder: getCountMonthOrderData,
                countTransaction: getCountTransactionData,
                countCancel: getCountCancelData
            };

            await redis.set(key, JSON.stringify(currentMonthData));
            redis.expire(key, 60 * 60);

            return currentMonthData;
        } catch (error) {
            throw new Error('Internal Server Error');
        }
    };

    static getCurrentYearlyStatictisService = async (currentYear) => {
        try {
            const key = `current-yearly-order-${currentYear}`;
            const cache = await redis.get(key);
            if (cache) {
                return JSON.parse(cache);
            }

            const [yearOrderData, yearTransactionData, getCountYearOrderData, getCountYearTransactionData, getCountYearCancelData] = await Promise.all([
                statisticRepository.getRecentlyYearlyOrderFromDB(currentYear),
                statisticRepository.getRecentlyYearlyTransactionFromDB(currentYear),
                statisticRepository.getCountYearOrderDataFromDB(currentYear),
                statisticRepository.getCountYearTransactionrDataFromDB(currentYear),
                statisticRepository.getTotalCancelOrderByYearFromDB(currentYear)
            ]);

            const currentYearData = {
                order: yearOrderData,
                transaction: yearTransactionData,
                countOrder: getCountYearOrderData,
                countTransaction: getCountYearTransactionData,
                countCancel: getCountYearCancelData
            };

            await redis.set(key, JSON.stringify(currentYearData));
            redis.expire(key, 60 * 60);

            return currentYearData;
        } catch (error) {
            throw new Error(error);
        }
    }

    static getNumberOfOrdersByMonthYearService = async () => {
        try {
            const currentYear = new Date().getFullYear()
            const key = `number-of-orders-by-month-year-${currentYear}`;
            const cache = await redis.get(key);
            if (cache) {
                return JSON.parse(cache);
            }

            const data = await statisticRepository.getRecentlyYearlyOrderFromDB(currentYear);

            await redis.set(key, JSON.stringify(data));
            redis.expire(key, 60 * 60 * 24);

            return data;
        } catch (error) {
            throw new Error(error);
        }
    };
}