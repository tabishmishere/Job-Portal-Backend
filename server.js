import express from "express";
import dotenv from "dotenv";
import connectDB from "../Backend/config/dbconn.js";
import userRoutes from "./routers/userRouters.js";
import cors from 'cors'
import jobRoutes from "./routers/jobRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],// frontend URL
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// 👇 Route Prefix must match your frontend fetch URL
app.use("/api", userRoutes);

app.use("/api/jobs", jobRoutes);

// Error handling (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`RUNNING PORT: ${PORT}`));
