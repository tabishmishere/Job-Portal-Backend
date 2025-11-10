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


router.get("/my-jobs", protect, authorizeRoles("recruiter"), getJobsByRecruiter);

router.get("/:id", getJobById);


router.put("/:id", protect, authorizeRoles("recruiter"), updateJob);


router.delete("/:id", protect, authorizeRoles("recruiter"), deleteJob);

export default router;
