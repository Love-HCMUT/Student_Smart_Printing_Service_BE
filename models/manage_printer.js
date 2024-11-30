import dbs from "../config/mysql-dbs.js";

export class PrinterService {
  // Lấy danh sách máy in mà SPSO quản lý
  // Lấy danh sách máy in mà SPSO quản lý



  static async getPrintersBySPSO() {
    const query = `
          SELECT 
            printer.id AS printer_id,
            printer.brand,
            printer.model,
            printer.printerDescription AS description,
            CONCAT(location.campus, " - ", location.building, " - ", location.room) AS location,
            printer.printerStatus AS status
          FROM printer
          JOIN location ON printer.locationID = location.id
        `;
    const [rows] = await dbs.promise().query(query);
    return rows;
  }

  // Hàm để thêm vị trí
  static async addLocation(campus, building, room) {
    const [result] = await dbs.promise().query(
      `INSERT INTO location (campus, building, room)
             VALUES (?, ?, ?)`,
      [campus, building, room]
    );
    return result.insertId; // Trả về ID của vị trí vừa tạo
  }

    // Hàm để them manipulation
    static async addManipulation(spsoID, printerID, spsoAction) {
      const actionTime = new Date();
      const [result] = await dbs.promise().query(
        `INSERT INTO manipulation (spsoID, printerID, spsoAction, actionTime)
               VALUES (?, ?, ?, ?)`,
        [spsoID, printerID, spsoAction, actionTime]
      );
      return result.insertId; // Trả về ID của vị trí vừa tạo
    }

  static async addManage(spsoID, printerID) {
    const [result] = await dbs.promise().query(
      `INSERT INTO manage (spsoID, printerID)
             VALUES (?, ?)`,
      [spsoID, printerID]
    );
    return result.insertId; // Trả về ID của vị trí vừa tạo
  }

  static async findOrAddLocation(campus, building, room) {
    // Kiểm tra xem vị trí có tồn tại trong bảng location không
    const [rows] = await dbs
      .promise()
      .query(
        `SELECT id FROM location WHERE campus = ? AND building = ? AND room = ?`,
        [campus, building, room]
      );

    if (rows.length > 0) {
      // Nếu vị trí tồn tại, trả về ID
      return rows[0].id;
    } else {
      // Nếu không tồn tại, trả về 0
      return 0;
    }
  }

  static async findOrAddManage(spsoID,printerID) {
    // Kiểm tra xem vị trí có tồn tại không
    const rows = await dbs
      .promise()
      .query(
        `SELECT spsoID FROM manage WHERE spsoID = ? AND printerID = ?`,
        [spsoID,printerID]
      );

    if (rows[0].length > 0) {
      // Nếu vị trí tồn tại, trả về ID
      return 1;
    } else {
      // Nếu không tồn tại, trả về 0
      return 0;
    }
  }

  // Hàm để thêm máy in
  static async addPrinter(
    printerStatus,
    printerDescription,
    resolution,
    colorPrinting,
    side,
    price,
    model,
    speed,
    brand,
    wireless,
    printingMethod,
    locationID
  ) {
    const [result] = await dbs.promise().query(
      `INSERT INTO printer 
            (printerStatus, printerDescription, resolution, colorPrinting, side, price, model, speed, brand, wireless, printingMethod, locationID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        printerStatus,
        printerDescription,
        resolution,
        colorPrinting,
        side,
        price,
        model,
        speed,
        brand,
        wireless,
        printingMethod,
        locationID,
      ]
    );
    return {
      printerID: result.insertId,
      printerStatus,
      printerDescription,
      resolution,
      colorPrinting,
      side,
      price,
      model,
      speed,
      brand,
      wireless,
      printingMethod,
      locationID,
    }; // Trả về ID của máy in vừa thêm
  }

  // Hàm để cập nhật trạng thái của một danh sách máy in
  static async updatePrinterStatus(printerStatus, printerIds) {
    const placeholders = printerIds.map(() => "?").join(", ");
    const query = `
            UPDATE printer 
            SET printerStatus = ? 
            WHERE id IN (${placeholders})
        `;
    const [result] = await dbs
      .promise()
      .query(query, [printerStatus, ...printerIds]);
    return result;
  }

  // Hàm để cập nhật tất cả dữ liệu của một máy in
  static async updatePrinter(
    printerId,
    printerStatus,
    printerDescription,
    resolution,
    colorPrinting,
    side,
    price,
    model,
    speed,
    brand,
    wireless,
    printingMethod,
    locationID
  ) {
    const query = `
            UPDATE printer 
            SET 
                printerStatus = ?, 
                printerDescription = ?, 
                resolution = ?, 
                colorPrinting = ?, 
                side = ?, 
                price = ?, 
                model = ?, 
                speed = ?, 
                brand = ?, 
                wireless = ?, 
                printingMethod = ?, 
                locationID = ?
            WHERE id = ?
        `;
    const values = [
      printerStatus,
      printerDescription,
      resolution,
      colorPrinting,
      side,
      price,
      model,
      speed,
      brand,
      wireless,
      printingMethod,
      locationID,
      printerId,
    ];

    const [result] = await dbs.promise().query(query, values);
    return result;
  }

  static async getAllPrinters() {
    const [rows] = await dbs.promise().query(`
            SELECT 
                printer.id AS printer_id,
                printer.brand,
                printer.model,
                printer.printerDescription AS description,
                CONCAT(location.campus, " - ", location.building, " - ", location.room) AS location,
                printer.printerStatus AS status
            FROM printer
            JOIN location ON printer.locationID = location.id
        `);
    return rows;
  }

  static async getPrintersByIds(printerIds) {
    // Tạo danh sách dấu `?` để chèn vào query
    const placeholders = printerIds.map(() => "?").join(",");

    const query = `
      SELECT 
        printer.id AS printer_id,
        printer.brand,
        printer.model,
        printer.printerStatus AS status,
        location.campus,
        location.building,
        location.room,
        printer.printerDescription AS description,
        printer.resolution,
        printer.colorPrinting AS color,
        printer.side AS oneTwoSide,
        printer.price,
        printer.speed,
        printer.wireless AS wirelessConnection,
        printer.printingMethod
      FROM printer
      JOIN location ON printer.locationID = location.id
      WHERE printer.id IN (${placeholders})
    `;

    const [rows] = await dbs.promise().query(query, printerIds);
    return rows;
  }
}
