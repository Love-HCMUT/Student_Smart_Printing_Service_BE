import express from 'express'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import centralizeRouter from './routes/index.js'
import { connectMysql } from './config/mysql-dbs.js'
import swaggerOptions from './config/swagger-config.js'
import { createResponse } from './config/api-response.js'
import dbs from './config/mysql-dbs.js'
import { sessionMiddleware } from './config/sessionConfig.js';
import accountRouter from "./routes/account-router.js";
import PrinterRouter from "./routes/manage_printer.js"
import cors from "cors"

const app = express()
dotenv.config()

connectMysql()


// Tạo Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(cors({
    origin: ['http://localhost:5173', 'https://ebc7-171-247-146-191.ngrok-free.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Các method HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
    credentials: true,
}));

// Sử dụng Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))


// parse json
app.use(express.json())
app.use(sessionMiddleware);
// Middleware để xử lý dữ liệu URL-encoded
app.use(express.urlencoded({ extended: true }));

//routing 
app.use(centralizeRouter)
app.use("/api/account", accountRouter);
app.use("/api/printer", PrinterRouter);


const port = process.env.PORT

app.listen(port, () => {
    console.log(`Example app on port http://localhost:${port}`)
})