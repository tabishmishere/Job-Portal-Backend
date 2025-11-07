import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbconn.js";
import cors from "cors";
import path from "path";
import userRoutes from "./routers/userRouters.js";
import jobRoutes from "./routers/jobRoutes.js";
import applicationRoutes from "./routers/applicationRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());
app.use("/uploads/cv", express.static(path.join(process.cwd(), "uploads/cv")));
app.use("/uploads", express.static("uploads"));


app.use("/api", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`RUNNING PORT: ${PORT}`));
