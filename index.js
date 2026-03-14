import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Mongodbconnnection from "./Database/DbConnection";

dotenv.config(); 
const app = express()

// Database connection 
Mongodbconnnection();
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

app.get("/", (req, res) => {
    res.send("Service Backend is Running!")
})

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
})