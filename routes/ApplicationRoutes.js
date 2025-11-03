import express from "express";
import {
  createApplication,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
  getRecruiterApplications
} from "../controllers/ApplicationController.js";

const router = express.Router();

router.post("/", createApplication); // Create a new application
router.get("/user/:userId", getUserApplications); // Get applications by user
router.get("/job/:jobId", getJobApplications); // Get applications by job
router.get("/recruiter/:recruiterId", getRecruiterApplications); // recruiter dashboard
router.patch("/:applicationId", updateApplicationStatus); // Update status
router.delete("/:applicationId", deleteApplication); // Delete application

export default router;
