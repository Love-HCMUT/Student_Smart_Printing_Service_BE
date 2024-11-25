import { orderModel } from "../models/index.js";

const addOrder = async (printerID = 1) => {
  return await orderModel.addOrder(printerID);
};

const getOrder = async (printerID = 1) => {
  return await orderModel.getOrder(printerID);
};

export { addOrder, getOrder };
