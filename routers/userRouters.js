import express from "express";
import multer from "multer";
import {
  getAllUsers,
  createAllUsers,
  loginUser,
  updateUser,
  verifyEmail,
  resendVerificationLink,
} from "../controllers/userController.js";

import {
  adminGetAllUsers,
  adminUpdateUserRole,
  adminDeleteUser,
  adminDeleteJob,
  getAdminProfile,
  updateAdminProfile,
  getDashboardStats,
  adminGetRecentJobs,
  adminGetRecentUsers,
} from "../controllers/adminController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/rolemiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });


router.get("/users/verify/:token", verifyEmail);
router.post("/users/resend-verification", resendVerificationLink);
router.post("/users/signup", createAllUsers);
router.post("/users/login", loginUser);

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id", protect, upload.single("avatar"), updateUser);



router.get("/admin/profile", protect, authorizeRoles("admin"), getAdminProfile);
router.put(
  "/admin/profile",
  protect,
  authorizeRoles("admin"),
  upload.single("avatar"),
  updateAdminProfile
);


router.get("/admin/users", protect, authorizeRoles("admin"), adminGetAllUsers);
router.put("/admin/users/:id", protect, authorizeRoles("admin"), adminUpdateUserRole);
router.delete("/admin/users/:id", protect, authorizeRoles("admin"), adminDeleteUser);


router.delete("/admin/jobs/:id", protect, authorizeRoles("admin"), adminDeleteJob);


router.get("/admin/dashboard-stats", protect, authorizeRoles("admin"), getDashboardStats);


router.get("/admin/jobs/recent", protect, authorizeRoles("admin"), adminGetRecentJobs);
router.get("/admin/users/recent", protect, authorizeRoles("admin"), adminGetRecentUsers);



export default router;
