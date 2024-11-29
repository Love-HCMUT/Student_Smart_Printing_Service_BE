import { PrinterService } from "../models/manage_printer.js";
import { createResponse } from "../config/api-response.js";

export class PrinterController {
  // Thêm máy in mới
  static async addPrinter(req, res) {
    try {
      const { spsoID } = req.query;
      const {
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
        campus,
        building,
        room,
      } = req.body;

      let locationID = await PrinterService.findOrAddLocation(
        campus,
        building,
        room
      );
      if (locationID == "0") {
        locationID = await PrinterService.addLocation(campus, building, room);
      }

      const printer = await PrinterService.addPrinter(
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
      );
      const manage = await PrinterService.addManage(spsoID, printer.printerID)
      res
        .status(201)
        .json(createResponse(true, "Printer added successfully", printer));
    } catch (error) {
      res
        .status(500)
        .json(createResponse(false, "Error adding printer", error.message));
    }
  }

  // Cập nhật trạng thái cho danh sách máy in
  static async updatePrinterStatus(req, res) {
    try {
      const { printerStatus } = req.body;
      const { printerIds } = req.body; // Expecting an array of IDs

      if (!Array.isArray(printerIds) || printerIds.length === 0) {
        return res
          .status(400)
          .json({ message: "printerIds must be a non-empty array" });
      }

      await PrinterService.updatePrinterStatus(printerStatus, printerIds);
      res
        .status(200)
        .json(createResponse(true, "Printer statuses updated successfully"));
    } catch (error) {
      res
        .status(500)
        .json(createResponse(false, "Error updating printer statuses"));
    }
  }

  // Cập nhật toàn bộ dữ liệu của một máy in
  static async updatePrinter(req, res) {
    try {
      const { id } = req.params; // Printer ID from the URL
      const {
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
        campus,
        building,
        room,
      } = req.body;

      let locationID = await PrinterService.findOrAddLocation(
        campus,
        building,
        room
      );
      if (locationID == 0) {
        locationID = await PrinterService.addLocation(campus, building, room);
      }

      await PrinterService.updatePrinter(
        id,
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
      );
      res
        .status(200)
        .json(createResponse(true, "Printer updated successfully"));
    } catch (error) {
      res.status(500).json(createResponse(false, "Error updating printer"));
    }
  }

  // Lấy thông tin tất cả máy in
  static async getAllPrinters(req, res) {
    try {
        const { spsoID } = req.query; // Lấy từ query string
        const printers = await PrinterService.getPrintersBySPSO(spsoID);
        res
            .status(200)
            .json(createResponse(true, "Successful fetching printers", printers));
    } catch (error) {
        res
            .status(500)
            .json(createResponse(false, "Error fetching printers", error.message));
    }
}


  // Lấy thông tin một máy in cụ thể
  static async getPrintersByIds(req, res) {
    try {
      const { ids } = req.body;
      const printer = await PrinterService.getPrintersByIds(ids);

      if (!printer) {
        return res.status(404).json(createResponse(false, "Printer not found"));
      }

      res.status(200).json(createResponse(true, "Successful", printer));
    } catch (error) {
      res
        .status(500)
        .json(createResponse(false, "Error fetching printer", error.message));
    }
  }
}
