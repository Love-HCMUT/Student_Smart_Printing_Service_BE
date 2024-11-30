import express from "express";
import { PrinterController } from "../controllers/manage_printer.js";

const router = express.Router();

router.post("/add", PrinterController.addPrinter);

router.put("/update-status", PrinterController.updatePrinterStatus);

router.put("/update/:spsoID/:id", PrinterController.updatePrinter);

router.get("/get_printer", PrinterController.getAllPrinters);

router.post("/update_printer", PrinterController.getPrintersByIds);

export default router;
