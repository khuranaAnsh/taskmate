import express from "express";
import { setRole, getTeamMembers } from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/users/set-role
router.post("/set-role", auth, setRole);
router.get("/team-members", getTeamMembers);
export default router;
