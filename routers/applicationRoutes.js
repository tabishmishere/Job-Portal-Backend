import express from "express";
import { applyToJob, getRecruiterApplications, updateApplicationStatus } from "../Controllers/applicationController.js";
import { protect } from "../middlewares/authMiddleware.js"; 
import { upload } from "../middlewares/upload.js";
import { getUserApplications } from "../controllers/applicationController.js";


const router = express.Router();


router.get("/user/:id", protect, getUserApplications);
router.get("/recruiter", protect, getRecruiterApplications);
router.put("/:id/status", protect, updateApplicationStatus);
router.post("/:jobId", protect, upload.single("cv"), applyToJob);

export default router;
