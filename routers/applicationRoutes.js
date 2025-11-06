import express from "express";
import { applyToJob, getRecruiterApplications, updateApplicationStatus } from "../Controllers/applicationController.js";
import { protect } from "../middlewares/authMiddleware.js"; // your auth middleware
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/recruiter", protect, getRecruiterApplications);
router.put("/:id/status", protect, updateApplicationStatus);
router.post("/:jobId", protect, upload.single("cv"), applyToJob);

export default router;
