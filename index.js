import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import centralizeRouter from "./routes/index.js";
import { connectMysql } from "./config/mysql-dbs.js";

const app = express();
dotenv.config();

connectMysql();

// parse json
app.use(express.json());
// Middleware để xử lý dữ liệu URL-encoded
app.use(express.urlencoded({ extended: true }));

//routing
app.use(cors());
app.use(centralizeRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
