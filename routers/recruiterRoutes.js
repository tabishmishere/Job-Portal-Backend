import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/rolemiddleware.js";
import { avatarUpload } from "../middlewares/avatarUpload.js";
import {
  updateRecruiterProfile,
  getRecruiterDashboard,
} from "../controllers/recruiterController.js";

const router = express.Router();


router.put(
  "/profile",
  protect,
  authorizeRoles("recruiter"),
  avatarUpload.single("avatar"),
  updateRecruiterProfile
);


router.get(
  "/dashboard",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterDashboard
);

export default router;
