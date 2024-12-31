// handle data from database
import axios from "axios";
import crypto from "crypto";
import payment from "../services/payment-service.js";
import config from "../config/load-config.js";
import { createResponse } from "../config/api-response.js";
import paymentModel from "../models/payment-model.js";
import userModel from "../models/user-model.js";
import { clearInterval } from "timers";

// get
const createPaymentLink = async (req, res) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var accessKey = config.MOMO_ACCESS_KEY;
  var secretKey = config.MOMO_SECRET_KEY;
  var orderInfo = req.body.note;
  var partnerCode = "MOMO";
  var redirectUrl = config.MOMO_REDIRECT_URL;
  var ipnUrl = `${config.MOMO_IPN_URL}/payment/result`;
  var requestType = "payWithMethod";
  var amount = req.body?.money ? req.body?.money : 0;
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;

  const moredata = {
    combo: req.body?.combo,
    userid: req.body?.id
  }

  var extraData = JSON.stringify(moredata);
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  //signature

  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  //json object send to MoMo endpoint
  const reqBody = {
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  };

  const requestBody = JSON.stringify(reqBody)

  //option for axios
  const option = {
    method: "POST",
    url: `${config.MOMO_GATEWAY_URL}/create`,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    let result = await axios(option);
    const respone = createResponse(true, "Get payment link successfully", {
      payUrl: result.data.payUrl,
      orderId: result.data.orderId,
      money: result.data.amount,
    });

    // let momotest = axios.post('http://localhost:8888/test-momo', reqBody)
    // console.log(momotest)

    return res.status(200).json(respone);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ mess: `loi xay ra ${err}` });
  }
};

const handleDataFromMomoService = async (req, res) => {
  try {
    console.log("Receive result data from momo service")
    console.log(req.body)
    const resultCode = req.body?.resultCode;
    const { combo, userid } = JSON.parse(req.body?.extraData)
    console.log("user id", userid)
    const info = resultCode === 0 ? req.body.orderInfo : undefined;
    const note = info ? info : "giao dich that bai"
    const now = new Date();
    const money = resultCode === 0 ? req.body.amount : undefined;

    const coins = combo.reduce((a, b) => a + b.numCoins, 0)

    console.log(resultCode, combo, note, userid, now, money)
    // // update database
    const t = await paymentModel.createDepositLog(now, money, note, userid, combo);

    const check = await userModel.updateUserBalance(userid, coins);  // -> need to replace with sql procedure
    if (!t || !check) return res.status(500)
    return res.status(200).json(createResponse(true, "update payment data successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(createResponse(false, "fail when updating payment logs"));
  }
};

const checkStatusPayment = async (req, res) => {
  const orderId = req.params.id;

  var secretKey = config.MOMO_SECRET_KEY;
  var accessKey = config.MOMO_ACCESS_KEY;
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  });

  // options for axios
  const options = {
    method: "POST",
    url: `${config.MOMO_GATEWAY_URL}/query`,
    // url: `http://localhost:8888/query`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  let statusCode = 1000;
  let result;
  let count = 0;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  while ([1000, 9000, 7002, 7000].includes(statusCode) && count < 100) {
    try {
      result = await axios(options);
      // console.log(result)
      statusCode = result.data.resultCode;
      count++;
      await delay(2000);
    } catch (error) {
      console.log("Error when checking status payment ", error);
      res
        .status(400)
        .json(createResponse(false, "Error when checking status payment"));
    }
  }
  if (statusCode === 0)

    // check database 
    ///...........
    return res
      .status(200)
      .json(createResponse(true, "Success payment", result.data));
  else
    return res
      .status(400)
      .json(createResponse(false, "Fail to pay", result.data));
};

const updateBalance = async (req, res) => {
  const money = req.body.money;
  if (!money)
    return res
      .status(401)
      .json(createResponse(false, "Missing required money parameter"));
  // fixed customer id
  const id = req.body.id;
  const check = await userModel.updateUserBalance(id, money);
  if (check)
    return res
      .status(200)
      .json(createResponse(true, "Update balance successfully"));
  else
    return res.status(400).json(createResponse(false, "Update balance fail"));
};

const loadComboData = async (req, res) => {
  const result = await paymentModel.loadCombo();
  if (!result)
    return res
      .status(400)
      .json(createResponse(false, "fail when loading combo"));
  return res
    .status(200)
    .json(createResponse(true, "Loading combo successfully", result));
};

export default {
  createPaymentLink,
  handleDataFromMomoService,
  checkStatusPayment,
  updateBalance,
  loadComboData,
};
