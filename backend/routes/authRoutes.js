import express from "express";
import { register, login } from "../controllers/authController.js"; // include .js!
import {
  getUsers,
  getUserById,
  getCurrentUser,
} from "../controllers/authController.js"; // include .js!
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers); // Get all users
router.get("/users/me", auth, getCurrentUser);
router.get("/users/:id", getUserById); // Get a single user by ID

// for fetching the current user details

export default router;
