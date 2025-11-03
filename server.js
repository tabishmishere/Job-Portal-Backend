import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/db.js";
import jobRoutes from "./routes/JobRoute.js";
import applicationRoutes from "./routes/ApplicationRoutes.js";
import userRoutes from "./routes/UserRoutes.js";

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

// Basic route to test server
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
