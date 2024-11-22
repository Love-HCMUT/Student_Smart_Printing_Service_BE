import dbs from '../config/mysql-dbs.js'


async function insertDepositLog(id, note = '', customerID = 1, method = "momo-wallet") {
    try {
        const sql = `
        INSERT INTO depositLog (id, method, note, customerID)
        VALUES (?, ?, ?, ?)
        `;
        const [result] = await dbs.promise().execute(sql, [id, method, note, customerID]);
        console.log('Insert deposit logs successfuly:', result);
        return result.insertId;
    } catch (error) {
        console.error('Error inserting into depositLog:', error.message);
        throw error;
    }
}

async function insertDepositCombo(depositId, comboId, quantity) {
    try {
        console.log(depositId, comboId)
        const sql = `
        INSERT INTO depositCombo (LogID, comboID, quantity)
        VALUES (?, ?, ?)
        `;
        const [result] = await dbs.promise().execute(sql, [depositId, comboId, quantity]);
        console.log('Insert deposit combo successfuly:', result);
        return result.insertId;
    } catch (error) {
        console.error('Error inserting into deposit combo:', error.message);
        throw error;
    }
}


async function insertPaymentlog(time, money) {
    try {
        const sql = `
        INSERT INTO paymentLog (paymentTime, money)
        VALUES (?, ?)
        `;
        const [result] = await dbs.promise().execute(sql, [time, money]);
        console.log('Insert payment logs successfuly:', result);
        return result.insertId;
    } catch (error) {
        console.error('Error inserting into paymentlog:', error.message);
        throw error;
    }
}

async function createDepositLog(time, money, note, customerID, combo) {
    const paymentLogId = await insertPaymentlog(time, money)
    const depositLogId = await insertDepositLog(paymentLogId, note, customerID)

    if (Array.isArray(combo)) {
        combo.forEach(async e => {
            await insertDepositCombo(paymentLogId, e.combo_id, e.quantity)
        })
    }
    else {
        console.log("combo khong phai la mang")
    }
}

export default {
    // insertPaymentlog,
    // insertDepositLog,
    // insertDepositCombo,
    createDepositLog
}