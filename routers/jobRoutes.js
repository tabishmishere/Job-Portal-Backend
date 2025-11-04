import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../Controllers/jobController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create job - only recruiters
router.post("/", protect, authorizeRoles("recruiter"), createJob);

// Get all jobs - public
router.get("/", getAllJobs);

// Get job by ID - public
router.get("/:id", getJobById);

// Update job - only recruiter who created it (or you can adjust logic in controller)
router.put("/:id", protect, authorizeRoles("recruiter"), updateJob);

// Delete job - only recruiter who created it (or adjust in controller)
router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);

export default router;
