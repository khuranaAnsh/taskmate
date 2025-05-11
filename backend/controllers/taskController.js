import { Task } from "../models/taskmodel.js";
import { createNotification } from "./notificationController.js";

// Create a task
export const createTask = async (req, res, next) => {
  try {
    console.log(req.body);
    const { assignedTo } = req.body;
    if (assignedTo === "myself") {
      req.body.assignedTo = req.user.id;
    }
    const task = await Task.create(req.body);
    await createNotification(
      req.user.id,
      `New task "${task.title}" created and assigned to you`,
      "info"
    );
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Get all tasks
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Get a single task
export const getTask = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Update a task
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ assignedTo: userId }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Example: Fetch all tasks
export const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: { $exists: true, $ne: null },
    }).populate("assignedTo", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOngoingTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "In Progress" });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching ongoing tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOverdueTasks = async (req, res) => {
  try {
    const currentDate = new Date();
    const tasks = await Task.find({
      dueDate: { $lt: currentDate },
      status: { $ne: "Completed" },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching overdue tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
