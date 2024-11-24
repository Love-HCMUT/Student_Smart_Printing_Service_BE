import { statisticRepository } from '../models/statistic-repository.js';

export class statisticService {
    static getRecentlyMonthlyOrderService = async () => {
        try {
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

            return {
                currentMonth: currentMonthData,
                lastMonth: lastMonthData,
                twoMonthsAgo: twoMonthsAgoData
            };

        } catch (error) {
            throw new Error('Internal Server Error');
        }
    };

    static getCurrentMonthlyOrderService = async (currentMonth, currentYear) => {
        try {

            const currentMonthData = await statisticRepository.getRecentlyMonthlyOrderFromDB(currentMonth, currentYear);

            return {
                currentMonth: currentMonthData
            };

        } catch (error) {
            throw new Error('Internal Server Error');
        }
    };

    static getTotalCountService = async () => {
        try {
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

            return total;

        } catch (error) {
            throw new Error(error);
        }
    };

    static getNumberOfOrdersByMonthYearService = async () => {
        try {
            const data = await statisticRepository.getNumberOfOrdersByMonthYearFromDB();
            return data;
        } catch (error) {
            throw new Error(error);
        }
    };

    static getNumberOfTransactionByMonthYearService = async () => {
        try {
            const data = await statisticRepository.getNumberOfTransactionByMonthYearFromDB();
            return data;
        } catch (error) {
            throw new Error(error);
        }
    };
}