import dbs from "../config/mysql-dbs.js";

// async function insertDepositLog(id, note = "", customerID = 1, method = "momo-wallet") {
//   try {
//     const sql = `
//         INSERT INTO depositLog (id, method, note, customerID)
//         VALUES (?, ?, ?, ?)
//         `;
//     const [result] = await dbs
//       .promise()
//       .execute(sql, [id, method, note, customerID]);
//     return result.insertId;
//   } catch (error) {
//     console.error("Error inserting into depositLog:", error.message);
//     throw error;
//   }
// }

// async function insertDepositCombo(depositId, comboId, quantity) {
//   try {
//     const sql = `
//         INSERT INTO depositCombo (LogID, comboID, quantity)
//         VALUES (?, ?, ?)
//     `;
//     const [result] = await dbs
//       .promise()
//       .execute(sql, [depositId, comboId, quantity]);
//     return result.insertId;
//   } catch (error) {
//     console.error("Error inserting into deposit combo:", error.message);
//     throw error;
//   }
// }

// async function insertPaymentlog(time, money) {
//   try {
//     const sql = `
//         INSERT INTO paymentLog (paymentTime, money)
//         VALUES (?, ?)
//         `;
//     const [result] = await dbs.promise().execute(sql, [time, money]);
//     return result.insertId;
//   } catch (error) {
//     console.error("Error inserting into paymentlog:", error.message);
//     throw error;
//   }
// }

// async function createDepositLog(time, money, note, customerID, combo) {
//   try {
//     const paymentLogId = await insertPaymentlog(time, money);
//     const depositLogId = await insertDepositLog(paymentLogId, note, customerID);

//     if (Array.isArray(combo)) {
//       combo.forEach(async (e) => {
//         await insertDepositCombo(paymentLogId, e.id, e.quantity);
//       });
//       return true
//     } else {
//       console.log("Error: Combo khong phai la mang");
//       return false
//     }
//   }
//   catch (error) {
//     console.log("fail when update payment data")
//     throw error
//   }
// }

async function createDepositLog(time, money, note, customerID, combo) {
  try {
    const sql = 'CALL SavePaymentDepositLog(?, ?, ?, ?)';
    const [result] = await dbs.promise().execute(sql, [time, money, note, customerID]);
    console.log(result)
    const paymentLogId = result[0][0]?.PaymentLogId;
    console.log("finish save deposit logs", paymentLogId)

    if (!paymentLogId) {
      console.log('Error: PaymentLogId không tồn tại');
      return false;
    }

    if (Array.isArray(combo)) {
      combo.forEach(async (e) => {

        const sql = `CALL saveDepositCombo(?, ?, ?)`
        console.log(e.id)
        console.log(typeof (e.id))

        await dbs.promise().execute(sql, [paymentLogId, e.id, e.quantity]);
        console.log("Save success combo", e.id)
      });
      return true
    } else {
      console.log("Error: Combo khong phai la mang");
      return false
    }

  }
  catch (error) {
    console.log("fail when update payment data")
    throw error
  }
}


async function loadCombo() {
  try {
    const sql = `CALL LoadCombo()`;
    const [result] = await dbs.promise().execute(sql);
    if (result[0]) return result[0];
    else return undefined;
  } catch (error) {
    console.log("Error when loading combo ", error);
    return undefined;
  }
}

export default {
  // insertPaymentlog,
  // insertDepositLog,
  // insertDepositCombo,
  createDepositLog,
  loadCombo,
};
