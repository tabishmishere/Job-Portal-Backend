import express from "express";
import dotenv from "dotenv";
import connectDB from "../Backend/config/dbconn.js";
import userRoutes from "./routers/userRouters.js";
import cors from 'cors';
import jobRoutes from "./routers/jobRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use("/api", userRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`RUNNING PORT: ${PORT}`));
