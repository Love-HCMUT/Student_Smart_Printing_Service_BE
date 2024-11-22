import dbs from '../config/mysql-dbs.js'

async function updateUserBalance(customerId, newBalance) {
    try {
        const sql = `UPDATE customer SET balance = ? WHERE id = ?`
        const [result] = await dbs.promise().execute(sql, [newBalance, customerId]);
        console.log('Update user balance successfuly:', result);
        return true
    } catch (error) {
        console.error('Error update user balance:', error.message);
        throw error;
    }
}


export default {
    updateUserBalance
}