import dbs from '../config/mysql-dbs.js'

async function updateUserBalance(customerId, addedBalance) {
    try {
        // 1. Lấy giá trị balance hiện tại
        const getBalanceSql = `SELECT balance FROM customer WHERE id = ?`;
        const [rows] = await dbs.promise().execute(getBalanceSql, [customerId]);

        if (rows.length === 0) {
            throw new Error(`Customer with ID ${customerId} not found`);
        }

        const currentBalance = rows[0].balance;

        const newBalance = currentBalance + addedBalance;

        const updateBalanceSql = `UPDATE customer SET balance = ? WHERE id = ?`;
        const [result] = await dbs.promise().execute(updateBalanceSql, [newBalance, customerId]);

        console.log('Update user balance successful:', result);
        return true;
    } catch (error) {
        console.error('Error updating user balance:', error.message);
        throw error;
    }
}


export default {
    updateUserBalance
}