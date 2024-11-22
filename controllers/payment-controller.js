// handle data from database 
import axios from 'axios'
import crypto from 'crypto'
import payment from '../services/payment-service.js'
import config from '../config/load-config.js'
import { createResponse } from '../config/api-response.js'
import paymentModel from '../models/payment-model.js'
import userModel from '../models/user-model.js'
import { clearInterval } from 'timers'


// get 
const createPaymentLink = async (req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    var accessKey = config.MOMO_ACCESS_KEY;
    var secretKey = config.MOMO_SECRET_KEY
    var orderInfo = req.body.note;
    var partnerCode = 'MOMO';
    var redirectUrl = config.MOMO_REDIRECT_URL
    var ipnUrl = `${config.MOMO_IPN_URL}/payment/result`
    var requestType = "payWithMethod";
    var amount = req.body?.money ? req.body?.money : 0;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = JSON.stringify(req.body?.combo);
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature

    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
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
        signature: signature
    });

    //option for axios 
    const option = {
        method: "POST",
        url: `${config.MOMO_GATEWAY_URL}/create`,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    }

    console.log(option)

    try {
        let result = await axios(option)
        const respone = createResponse(true, "Get payment link successfully", {
            "payUrl": result.data.payUrl,
            "orderId": result.data.orderId,
            "money": result.data.amount
        })
        return res.status(200).json(respone)

    }
    catch (err) {
        return res.status(500).json({ mess: `loi xay ra ${err}` })
    }
}


const handleDataFromMomoService = async (req, res) => {
    try {
        console.log("Call back::")
        console.log(req.body)

        const combo = JSON.parse(req.body?.extraData)
        const note = req.body.orderInfo
        const now = new Date()
        const money = req.body.amount

        console.log(combo, note, now, money)
        // update database 
        await paymentModel.createDepositLog(now, money, note, 1, combo)
        console.log("insert completed")
        return res.status(200)
    }
    catch (error) {
        return res.status(400)
    }
}


const checkStatusPayment = async (req, res) => {
    const orderId = req.params.id

    var secretKey = config.MOMO_SECRET_KEY
    var accessKey = config.MOMO_ACCESS_KEY
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: 'MOMO',
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: 'vi',
    });

    // options for axios
    const options = {
        method: 'POST',
        url: `${config.MOMO_GATEWAY_URL}/query`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: requestBody,
    };

    let statusCode = 1000
    let result

    while ([1000, 9000, 7002, 7000].includes(statusCode)) {
        try {
            result = await axios(options)
            statusCode = result.data.resultCode
        }
        catch (error) {
            console.log("Error when checking status payment")
            res.status(400).json(createResponse(false, "Error when checking status payment"))
        }
    }
    if (statusCode === 0)
        return res.status(200).json(createResponse(true, "Success payment", result.data));
    else return res.status(400).json(createResponse(false, "Fail to pay", result.data))
}

const updateBalance = async (req, res) => {
    const money = req.params.money
    if (!money) return res.status(401).json(createResponse(false, "Missing required money parameter"))
    // fixed customer id
    const check = await userModel.updateUserBalance(1, money)
    if (check) return res.status(200).json(createResponse(true, "Update balance successfully"))
    else return res.status(400).json(createResponse(false, "Update balance fail"))
}


export default {
    createPaymentLink,
    handleDataFromMomoService,
    checkStatusPayment,
    updateBalance
}