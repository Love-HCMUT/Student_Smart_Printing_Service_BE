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


const app = express()

// app.use(cors({
//     origin: '*', // Cho phép tất cả domain
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Các method HTTP được phép
//     allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
//     credentials: true,
// }));

dotenv.config()

connectMysql()
connectRedis()

// Tạo Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:7777', 'http://localhost:3000', 'http://127.0.0.1', 'https://ebc7-171-247-146-191.ngrok-free.app',],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Các method HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
    credentials: true,
}));

// app.use(cors())

// Sử dụng Swagger UICross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://backend:300
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))


// parse json
app.use(express.json())
app.use(sessionMiddleware);
// Middleware để xử lý dữ liệu URL-encoded
app.use(express.urlencoded({ extended: true }));

app.post('/test', async (req, res) => {
    try {
        // await test.insertDepositLog('2024-11-22 10:30:00', 50000)
        await test.loadCombo()
        res.status(200).json({ "mess": "true" })
    }
    catch (err) {
        res.status(400)
    }
})

//routing 
app.use("/api", centralizeRouter)


const port = process.env.PORT

app.listen(port, () => {
    console.log(`App thang ai listening on port http://localhost:${port}`)
})