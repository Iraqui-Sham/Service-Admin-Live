import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser";

import Mongodbconnnection from "./Database/DbConnection.js";
import SuperAdminRouter from "./Routes/SuperAdmin.route.js";
import AdminRoute from "./Routes/Admin.route.js"
import CategoryRoute from "./Routes/ServiceCategory.route.js";
import ServiceRouter from "./Routes/Service.route.js"

const app = express()

Mongodbconnnection();

app.use(helmet())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173", // 👈 frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['x-total-count'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/superadmin", SuperAdminRouter);
app.use("/admin",AdminRoute);
app.use("/category",CategoryRoute);
app.use("/service",ServiceRouter);

const PORT = process.env.PORT || 5100;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
})