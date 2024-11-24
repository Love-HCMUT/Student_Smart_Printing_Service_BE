// payment-service.js
import { paymentRepository } from "../models/payment-repository.js";

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
            return recentTransition ? recentTransition : `No recent transition found for customer ${customerId}`;
        } catch (error) {
            throw new Error('Error fetching recent transition');
        }
    };

    static getPaymentHistoryService = async (customerId) => {
        try {
            const paymentHistory = await paymentRepository.getPaymentHistoryFromDB(customerId);
            return paymentHistory.length ? paymentHistory : `No payment history found for customer ${customerId}`;
        } catch (error) {
            throw new Error('Error fetching payment history');
        }
    };

    static getTransactionAllService = async () => {
        try {
            const balanceAll = await paymentRepository.getTransactionAllFromDB();
            return balanceAll;
        } catch (error) {
            throw new Error('Error fetching balance');
        }
    }
}