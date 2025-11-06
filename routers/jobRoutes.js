// routers/jobRoutes.js
import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByRecruiter,
} from "../Controllers/jobController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/rolemiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("recruiter"), createJob);
router.get("/", getAllJobs);

// Get jobs for authenticated recruiter
router.get("/my-jobs", protect, authorizeRoles("recruiter"), getJobsByRecruiter);

// Get job by ID - public
router.get("/:id", getJobById);

// Update job - only recruiter who created it
router.put("/:id", protect, authorizeRoles("recruiter"), updateJob);

// Delete job - only recruiter who created it
router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);

export default router;
