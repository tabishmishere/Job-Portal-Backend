// routes/userRoutes.js
import express from "express";
import multer from "multer";
import {
  getAllUsers,
  createAllUsers,
  loginUser,
  updateUser,
} from "../Controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Public routes
router.post("/signup", createAllUsers);
router.post("/login", loginUser);

// Protected routes
router.get("/users", protect, authorizeRoles("admin"), getAllUsers); // Only admin can access all users
router.put("/user/:id", protect, upload.single("avatar"), updateUser); // Authenticated users can update themselves

export default router;
