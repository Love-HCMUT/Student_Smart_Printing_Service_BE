import dbs from "../config/mysql-dbs.js";

// export class AccountService {
//     // Hàm để thêm một tài khoản mới
//     static async addAccount(username, accountPassword, fullName, roles) {
//         const [result] = await dbs.promise().query(
//             `INSERT INTO account (username, accountPassword, fullName, roles) 
//              VALUES (?, ?, ?, ?)`,
//             [username, accountPassword, fullName, roles]
//         );
//         return result.insertId; // Trả về ID của tài khoản vừa tạo
//     }
//     static async findOrAddLocation(campus, building, room) {
//         // Kiểm tra xem vị trí có tồn tại trong bảng location không
//         const [rows] = await dbs.promise().query(
//             `SELECT id FROM location WHERE campus = ? AND building = ? AND room = ?`,
//             [campus, building, room]
//         );

//         if (rows.length > 0) {
//             // Nếu vị trí tồn tại, trả về ID
//             return rows[0].id;
//         } else {
//             // Nếu không tồn tại, trả về 0
//             return 0;
//         }
//     }

//     // Hàm để thêm một khách hàng
//     static async addCustomer(id) {
//         await dbs.promise().query(`INSERT INTO customer (id) VALUES (?)`, [id]);
//     }

//     // Hàm để thêm một SPSO
//     static async addSPSO(id) {
//         await dbs.promise().query(`INSERT INTO spso (id) VALUES (?)`, [id]);
//     }

//     // Hàm để thêm số điện thoại SPSO
//     static async addSPSOPhoneNumber(id, phoneNumbers) {
//         for (let phoneNumber of phoneNumbers) {
//             await dbs.promise().query(
//                 `INSERT INTO spsoPhoneNumbers (id, phoneNumber) VALUES (?, ?)`,
//                 [id, phoneNumber]
//             );
//         }
//     }

//     // Hàm để thêm số điện thoại nhân viên
//     static async addStaffPhoneNumber(id, phoneNumbers) {
//         for (let phoneNumber of phoneNumbers) {
//             await dbs.promise().query(
//                 `INSERT INTO staffPhoneNumbers (id, phoneNumber) VALUES (?, ?)`,
//                 [id, phoneNumber]
//             );
//         }
//     }

//     // Hàm để thêm vị trí
//     static async addLocation(campus, building, room) {
//         const [result] = await dbs.promise().query(
//             `INSERT INTO location (campus, building, room)
//              VALUES (?, ?, ?)`,
//             [campus, building, room]
//         );
//         return result.insertId; // Trả về ID của vị trí vừa tạo
//     }

//     // Hàm để thêm nhân viên
//     static async addStaff(id ,spsoID , locationID) {
//         await dbs.promise().query(`INSERT INTO staff (id,spsoID , locationID) VALUES (?, ?, ?)`, [id ,spsoID , locationID]);
//     }

//     // Hàm tìm tài khoản theo tên người dùng
//     static async findAccountByUsername(username) {
//         const [rows] = await dbs.promise().query(`SELECT * FROM account WHERE username = ?`, [username]);
//         return rows[0]; // Trả về tài khoản đầu tiên nếu tìm thấy
//     }
// }


export class AccountService {
    static async addAccount(username, accountPassword, fullName, roles) {
        const [result] = await dbs
            .promise()
            .query(`CALL add_account(?, ?, ?, ?)`, [
                username,
                accountPassword,
                fullName,
                roles,
            ]);
        return result[0][0].account_id; // Lấy ID của tài khoản vừa tạo
    }

    static async findOrAddLocation(campus, building, room) {
        const [rows] = await dbs
            .promise()
            .query(`CALL find_or_add_location(?, ?, ?)`, [campus, building, room]);
            if (rows[0].length > 0) {
                            // Nếu vị trí tồn tại, trả về ID
                             return rows[0][0].id;
                         } else {
                             // Nếu không tồn tại, trả về 0
                             return 0;
                         }
    }

    static async addCustomer(id) {
        await dbs.promise().query(`CALL add_customer(?)`, [id]);
    }

    static async addSPSO(id) {
        await dbs.promise().query(`CALL add_spso(?)`, [id]);
    }

    static async addSPSOPhoneNumber(id, phoneNumbers) {
        for (let phoneNumber of phoneNumbers) {
            await dbs
                .promise()
                .query(`CALL add_spso_phone_number(?, ?)`, [id, phoneNumber]);
        }
    }

    static async addStaffPhoneNumber(id, phoneNumbers) {
        for (let phoneNumber of phoneNumbers) {
            await dbs
                .promise()
                .query(`CALL add_staff_phone_number(?, ?)`, [id, phoneNumber]);
        }
    }

    static async addStaff(id, spsoID, locationID) {
        await dbs
            .promise()
            .query(`CALL add_staff(?, ?, ?)`, [id, spsoID, locationID]);
    }

        // Hàm để thêm vị trí
    static async addLocation(campus, building, room) {
        const [result] = await dbs.promise().query(
            `CALL addLocation(?,?,?)`,
            [campus, building, room]
        );
        return result[0][0].location_id; // Trả về ID của vị trí vừa tạo
    }

    static async findAccountByUsername(username) {
        const [rows] = await dbs
            .promise()
            .query(`CALL find_account_by_username(?)`, [username]);
        return rows[0][0]; // Trả về tài khoản đầu tiên nếu tìm thấy
    }
}

