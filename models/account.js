import dbs from "../config/mysql-dbs";

export class AccountService {
    // Hàm để thêm một tài khoản mới
    static async addAccount(username, accountPassword, fullName, role) {
        const result = await dbs.query(
            `INSERT INTO account (username, accountPassword, fullName, role) 
             VALUES (?, ?, ?, ?)`,
            [username, accountPassword, fullName, role]
        );
        return result[0].insertId; // Trả về ID của tài khoản vừa tạo
    }

    // Hàm để thêm một khách hàng
    static async addCustomer(id) {
        await dbs.query(`INSERT INTO customer (id) VALUES (?)`, [id]);
    }

    // Hàm để thêm một SPSO
    static async addSPSO(id) {
        await dbs.query(`INSERT INTO spso (id) VALUES (?)`, [id]);
    }

    // Hàm để thêm số điện thoại SPSO
    static async addSPSOPhoneNumber(id, phoneNumber) {
        await dbs.query(
            `INSERT INTO spsoPhoneNumbers (id, phoneNumber) VALUES (?, ?)`,
            [id, phoneNumber]
        );
    }

    // Hàm để thêm số điện thoại nhân viên
    static async addStaffPhoneNumber(id, phoneNumber) {
        await dbs.query(
            `INSERT INTO staffPhoneNumbers (id, phoneNumber) VALUES (?, ?)`,
            [id, phoneNumber]
        );
    }

    // Hàm để thêm vị trí
    static async addLocation(campus, building, room) {
        const result = await dbs.query(
            `INSERT INTO location (campus, building, room)
             VALUES (?, ?, ?)`,
            [campus, building, room]
        );
        return result[0].insertId; // Trả về ID của vị trí vừa tạo
    }

    // Hàm để thêm nhân viên
    static async addStaff(id, locationID) {
        await dbs.query(`INSERT INTO staff (id, locationID) VALUES (?, ?)`, [id, locationID]);
    }

    // Hàm tìm tài khoản theo tên người dùng
    static async findAccountByUsername(username) {
        const [rows] = await dbs.query(`SELECT * FROM account WHERE username = ?`, [username]);
        return rows[0]; // Trả về tài khoản đầu tiên nếu tìm thấy
    }
}
