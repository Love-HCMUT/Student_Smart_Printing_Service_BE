import express from 'express'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import centralizeRouter from './routes/index.js'
import { connectMysql } from './config/mysql-dbs.js'
import swaggerOptions from './config/swagger-config.js'
import { createResponse } from './config/api-response.js'
import test from './models/user-model.js'


const app = express()
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

app.post('/test', async (req, res) => {
    try {
        // await test.insertDepositLog('2024-11-22 10:30:00', 50000)
        await test.updateUserBalance(1, 900000)

        res.status(200).json({ "mess": "true" })
    }
    catch (err) {
        res.status(400)
    }
})

//routing 
app.use(centralizeRouter)


const port = process.env.PORT

app.listen(port, () => {
    console.log(`Example app on port http://localhost:${port}`)
})