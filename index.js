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

const app = express()
dotenv.config()

connectMysql()


// Tạo Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

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


const port = process.env.PORT

app.listen(port, () => {
    console.log(`Example app on port http://localhost:${port}`)
})