import express from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    updateProfile,
} from "../controllers/UserController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// User Registration and Login Routes
router.post("/register", createUser);
router.post("/login", loginUser);

// CRUD Routes
router.get("/", protect, admin, getAllUsers);  // Admin only access
router.get("/:id", protect, getUserById);  // Authenticated user can get own details
router.put("/:id", protect, updateUser);  // Authenticated user can update own details
router.delete("/:id", protect, admin, deleteUser);  // Admin can delete users

// Profile Update Route
router.put("/:id/profile", protect, updateProfile);

export default router;
