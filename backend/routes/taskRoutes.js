import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getAssignedTasks,
  getMyTasks,
  getOngoingTasks,
  getOverdueTasks,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getTasks).post(auth, createTask);

// ✅ Static or filtered routes first
router.get("/my-tasks", auth, getMyTasks);
router.get("/all", getAllTasks);
router.get("/assigned", getAssignedTasks);
router.get("/ongoing", getOngoingTasks);
router.get("/overdue", getOverdueTasks);

// ✅ Dynamic route last
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

export default router;
