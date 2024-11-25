import { orderModel } from "../models/index.js";

const addOrder = async (printerID = 1) => {
  return await orderModel.addOrder(printerID);
};

const getOrderByPrinterID = async (printerID = 1) => {
  return await orderModel.getOrderByPrinterID(printerID);
};

const updateOrderStatus = async (id = 2, orderStatus = "completed") => {
  return await orderModel.updateOrderStatus(id, orderStatus);
};

const updateOrderCompleteTime = async (id = 2) => {
  return await orderModel.updateOrderCompleteTime(id);
};

export {
  addOrder,
  getOrderByPrinterID,
  updateOrderStatus,
  updateOrderCompleteTime,
};
