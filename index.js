import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import centralizeRouter from './routes/index.js'
import { connectMysql } from './config/mysql-dbs.js'
import { connectRedis } from './config/redis-dbs.js'
import swaggerOptions from './config/swagger-config.js'
import { createResponse } from './config/api-response.js'
import test from './models/payment-model.js'
import dbs from './config/mysql-dbs.js'
import { sessionMiddleware } from './config/sessionConfig.js';
import accountRouter from "./routes/account-router.js";
import PrinterRouter from "./routes/manage_printer.js"
import session from 'express-session'

const app = express()
app.use(sessionMiddleware);


// app.use(cors({
//     origin: '*', // Cho phép tất cả domain
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Các method HTTP được phép
//     allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
// }));

dotenv.config()

connectMysql()
connectRedis()

// Tạo Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(cors({
    origin: ['http://localhost:5173', 'https://ebc7-171-247-146-191.ngrok-free.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// app.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: 'somesecret',
//     cookie: { maxAge: 60000 }
// }));

// Sử dụng Swagger UI


// parse json
app.use(express.json())
// Middleware để xử lý dữ liệu URL-encoded
app.use(express.urlencoded({ extended: true }));

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
// app.post('/test', async (req, res) => {
//     try {
//         // await test.insertDepositLog('2024-11-22 10:30:00', 50000)
//         await test.loadCombo()
//         res.status(200).json({ "mess": "true" })
//     }
//     catch (err) {
//         res.status(400)
//     }
// })

// app.get('/set_session', (req, res) => {
//     //set a object to session
//     req.session.User = {
//         website: 'anonystick.com',
//         type: 'blog javascript',
//         like: '4550'
//     }

//     console.log(req.session)

//     return res.status(200).json({ status: 'success' })
// })

//set session
// app.get('/get_session', (req, res) => {
//     //check session
//     console.log(req.session)
//     if (req.session.user) {
//         return res.status(200).json({ status: 'success', session: req.session.user })
//     }
//     return res.status(200).json({ status: 'error', session: 'No session' })
// })

//routing 
// app.use("/:test", (req, res) => console.log("your session ", req.session))
app.use("/api", centralizeRouter)
app.use("/api/api/account", accountRouter);
app.use("/api/api/printer", PrinterRouter);


const port = process.env.PORT

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
})
