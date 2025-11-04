import express from "express";
import {
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, recruiter } from "../middleware/auth.js";

const router = express.Router();

// Only recruiters can manage jobs
router.post("/add", protect, recruiter, createJob);
router.put("/:jobId", protect, recruiter, updateJob);
router.delete("/:jobId", protect, recruiter, deleteJob);

// Recruiter-specific jobs
// router.get("/my-jobs", protect, recruiter, getJobsByRecruiter);

export default router;
