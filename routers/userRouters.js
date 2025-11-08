import express from "express";
import multer from "multer";
import {
  getAllUsers,
  createAllUsers,
  loginUser,
  updateUser,
  verifyEmail,
  resendVerificationLink,
} from "../Controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/rolemiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Email verification
router.get("/users/verify/:token", verifyEmail);
router.post("/users/resend-verification", resendVerificationLink);

// Public routes
router.post("/users/signup", createAllUsers);
router.post("/users/login", loginUser);

// Protected routes
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id", protect, upload.single("avatar"), updateUser);

export default router;
