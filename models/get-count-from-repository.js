import dbs from "../config/mysql-dbs.js";

export const getCountFromRepository = async ({
    allOrderCount = false,
    allTransactionCount = false,
    balanceFromCustomer = false,
    customerId = 0
}) => {
    const query = `CALL getCountFromRepository(?, ?, ?, ?)`;
    const [rows] = await dbs.promise().query(query, [
        allOrderCount,
        allTransactionCount,
        balanceFromCustomer,
        balanceFromCustomer ? customerId : 0
    ]);
    if (balanceFromCustomer) {
        if (rows[0].length) {
            return rows[0][0].balance;
        } else {
            return null;
        }
    }
    return rows[0];
}