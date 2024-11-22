import express from 'express'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import centralizeRouter from './routes/index.js'
import connectMysql from './config/mysql-dbs.js'

const port = process.env.PORT || 3000

const app = express()
dotenv.config()

connectMysql()

// Cấu hình Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'A simple Express API documentation',
        },
        servers: [
            {
                url: `http://localhost:${port}`, // URL của server
            },
        ],
    },
    apis: ['./doc/*.yml'], // Đường dẫn đến các file chứa tài liệu API
};

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




app.listen(port, () => {
    console.log(`Example app on port http://localhost:${port}`)
})