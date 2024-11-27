import express from 'express'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import centralizeRouter from './routes/index.js'
import { connectMysql } from './config/mysql-dbs.js'
import swaggerOptions from './config/swagger-config.js'
import { createResponse } from './config/api-response.js'
import dbs from './config/mysql-dbs.js'
import cors from 'cors'
const app = express()

app.use(cors({
    origin: '*', // Cho phép tất cả domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Các method HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
}));

dotenv.config()

connectMysql()


// Tạo Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Sử dụng Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))


// parse json
app.use(express.json())
// Middleware để xử lý dữ liệu URL-encoded
app.use(express.urlencoded({ extended: true }));

//routing 
app.use(centralizeRouter)


const port = process.env.PORT

app.listen(port, () => {
    console.log(`Example app on port http://localhost:${port}`)
})