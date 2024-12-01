// handle data from database
import { minioService, orderService } from "../services/index.js";
import { generateMinioName } from "../services/orderService.js";
import { createResponse } from "../config/api-response.js";

const createOrder = async (req, res) => {
  try {
    const files = req.files;
    const { pages, customerID, printerID, note, totalCost, ...configs } =
      req.body;
    const numPages = JSON.parse(pages);
    const configArr = [];
    for (const key in configs) {
      configArr.push(JSON.parse(configs[key]));
    }
    // add order
    const insertedOrderInfo = await orderService.addOrder(printerID);
    const orderID = insertedOrderInfo.insertId;

    // add package
    const packageIDs = await Promise.all(
      configArr.map(async (config, index) => {
        const insertedPackageInfo = await orderService.addPackage({
          numOfCopies: config.copy,
          side: config.sides,
          colorAllPages: config.color_all,
          colorCover: config.color_cover,
          pagePerSheet: config.pages_per_sheet,
          paperSize: config.paper,
          scale: config.scale,
          cover: config.cover,
          glass: config.glass,
          binding: config.binding,
          orderID: orderID,
        });

        if (config.pages[0]) {
          // add package pages
          const { from_to, color, orientation } = config.pages[0];

          const from_tos = from_to.split(", ");
          from_tos.forEach((range) => {
            const [fromPage, toPage] = range.split("-");
            orderService.addPackagePrintingPages({
              packageID: insertedPackageInfo.insertId,
              color: color,
              fromPage: fromPage,
              toPage: toPage || fromPage,
              orientation: orientation,
            });
          });
        }
        return insertedPackageInfo.insertId;
      })
    );

    // add withdraw log
    const paymentLogID = (await orderService.addPaymentLog(Number(totalCost)))
      .insertId;
    await orderService.addWithdrawLog(paymentLogID);
    await orderService.decreaseCustomerBalance(customerID, totalCost);

    // add make orders
    const makeOrdersInfo = await orderService.addMakeOrders({
      customerID: customerID,
      orderID: orderID,
      logID: paymentLogID,
      note: JSON.parse(note),
    });

    // add file
    files.forEach(async (file) => {
      const minioName = await generateMinioName(file.originalname);
      const [i, j] = file.fieldname.split("-").map(Number);
      await minioService.uploadFileToMinio(file, minioName);
      await orderService.addFileMetadata({
        fileName: Buffer.from(file.originalname, "latin1").toString("utf8"),
        size: file.size,
        numPages: numPages[i][j],
        url: minioName,
        packageID: packageIDs[i],
      });
    });
    res.status(200).json(createResponse(true, "Create order successfully."));
  } catch (err) {
    console.log("Error in orderController - createOrder:", err);
    res
      .status(500)
      .json(createResponse(false, "An error occurred while creating an order"));
  }
};

const declineOrder = async (req, res) => {
  try {
    const { orderID, staffID, note } = req.body;
    // update order status
    await orderService.updateOrderStatus(orderID, "Declined");

    // get order cost
    const orderCostInfo = (await orderService.getOrderCost(orderID))[0];
    const { customerID, money } = orderCostInfo;

    // add return log
    const paymentLogID = (await orderService.addPaymentLog(money)).insertId;
    await orderService.addReturnLog(paymentLogID);
    await orderService.increaseCustomerBalance(customerID, money);

    // add decline orders
    await orderService.addDeclineOrders({
      staffID: staffID,
      orderID: orderID,
      logID: paymentLogID,
      note: note,
    });
    res.status(200).json(createResponse(true, "Decline order successfully."));
  } catch (err) {
    console.log("Error in declineOrder:", err);
    res
      .status(500)
      .json(
        createResponse(false, "An error occurred while declining an order")
      );
  }
};

const addOrder = async (req, res) => {
  res.json(await orderService.addOrder(req.params.printerID));
};

const getOrderByPrinterID = async (req, res) => {
  res.json(await orderService.getOrderByPrinterID(req.params.printerID));
};

const updateOrderStatus = async (req, res) => {
  res.json(await orderService.updateOrderStatus(req.body.id, req.body.status));
};

const updateOrderCompleteTime = async (req, res) => {
  res.json(await orderService.updateOrderCompleteTime(req.body.id));
};

const updateOrderStaffID = async (req, res) => {
  res.json(
    await orderService.updateOrderStaffID(req.body.id, req.body.staffID)
  );
};

const addPackage = async (req, res) => {
  res.json(await orderService.addPackage(req.body));
};

const addPackagePrintingPages = async (req, res) => {
  res.json(await orderService.addPackagePrintingPages(req.body));
};

const getPackageByOrderID = async (req, res) => {
  res.json(await orderService.getPackageByOrderID(req.body.orderID));
};

const getPackagePrintingPagesByPackageID = async (req, res) => {
  res.json(
    await orderService.getPackagePrintingPagesByPackageID(req.body.packageID)
  );
};

const addFileMetadata = async (req, res) => {
  res.json(await orderService.addFileMetadata(req.body));
};

const getFileMetadataByPackageID = async (req, res) => {
  res.json(await orderService.getFileMetadataByPackageID(req.body.packageID));
};

const addPaymentLog = async (req, res) => {
  res.json(await orderService.addPaymentLog(req.body.money));
};

const addWithdrawLog = async (req, res) => {
  res.json(await orderService.addWithdrawLog(req.body.id));
};

const addReturnLog = async (req, res) => {
  res.json(await orderService.addReturnLog(req.body.id));
};

const addMakeOrders = async (req, res) => {
  res.json(await orderService.addMakeOrders(req.body));
};

const addCancelOrders = async (req, res) => {
  res.json(await orderService.addCancelOrders(req.body));
};

const addDeclineOrders = async (req, res) => {
  res.json(await orderService.addDeclineOrders(req.body));
};

const getAllActivePrinter = async (req, res) => {
  res.json(await orderService.getAllActivePrinter(req.params));
};

const getCustomer = async (req, res) => {
  res.json(await orderService.getCustomer(req.params.customerID));
};

const getPrinterByStaffID = async (req, res) => {
  res.json(await orderService.getPrinterByStaffID(req.params.staffID));
};

const getPrinterAndOrder = async (req, res) => {
  const printers = await orderService.getPrinterByStaffID(req.params.staffID);
  const printerss = await Promise.all(
    printers.map(async (printer) => {
      printer.orders = await orderService.getOrderByPrinterID(
        printer.printerID
      );
      return printer;
    })
  );
  res.json(printerss);
};

const acceptOrder = async (req, res) => {
  const packages = await orderService.getPackageByOrderID(req.params.orderID);
  const packagess = await Promise.all(
    packages.map(async (p) => {
      p.printingPages = await orderService.getPackagePrintingPagesByPackageID(
        p.id
      );
      p.files = await orderService.getFileMetadataByPackageID(p.id);
      return p;
    })
  );
  await orderService.updateOrderStatus(req.params.orderID, "In progress");
  await orderService.updateOrderStaffID(req.params.orderID, req.params.staffID);
  res.json(packagess);
};

const printFile = async (req, res) => {
  try {
    await minioService.getFileFromMinio(req, res);
    const { orderID, logNumber, fileID } = req.params;
    await orderService.addPrintingLog({ orderID, logNumber, fileID });
  } catch (err) {
    console.log("Error in printFile:", err);
    res
      .status(500)
      .json(createResponse(false, "An error occurred while printing a file"));
  }
};

export {
  createOrder,
  addOrder,
  getOrderByPrinterID,
  updateOrderStatus,
  updateOrderCompleteTime,
  updateOrderStaffID,
  addPackage,
  addPackagePrintingPages,
  getPackagePrintingPagesByPackageID,
  getPackageByOrderID,
  addFileMetadata,
  getFileMetadataByPackageID,
  addPaymentLog,
  addWithdrawLog,
  addReturnLog,
  addMakeOrders,
  addCancelOrders,
  addDeclineOrders,
  getAllActivePrinter,
  getCustomer,
  getPrinterByStaffID,
  getPrinterAndOrder,
  acceptOrder,
  declineOrder,
  printFile,
};
