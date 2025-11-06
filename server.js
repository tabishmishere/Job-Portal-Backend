// backend/server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./dbconn.js";
import cors from "cors";
import path from "path";
import userRoutes from "./routers/userRouters.js";
import jobRoutes from "./routers/jobRoutes.js";
import applicationRoutes from "./routers/applicationRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/uploads/cv", express.static(path.join(process.cwd(), "uploads/cv")));

// Mount routers
app.use("/api", userRoutes);           // user routes (signup, login, etc.)
app.use("/api/jobs", jobRoutes);       // jobs
app.use("/api/applications", applicationRoutes);
app.use("/uploads", express.static("uploads"));


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`RUNNING PORT: ${PORT}`));
