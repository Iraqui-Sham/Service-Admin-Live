import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser";

import Mongodbconnnection from "./Database/DbConnection.js";
import SuperAdminRouter from "./Routes/SuperAdmin.route.js";

const app = express()

Mongodbconnnection();

app.use(helmet())
app.use(cookieParser())
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['x-total-count'],
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/superadmin", SuperAdminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
})