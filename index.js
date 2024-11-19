import express from 'express'
import dotenv from 'dotenv'
import centralizeRouter from './routes/index.js'

const app = express()
dotenv.config()

// parse json
app.use(express.json())
// Middleware để xử lý dữ liệu URL-encoded
app.use(express.urlencoded({ extended: true }));

//routing 
app.use(centralizeRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})