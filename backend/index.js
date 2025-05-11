import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import startReminderCron from "./cron/reminderCron.js";
// import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Handler
// app.use(errorHandler);
startReminderCron();
// DB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
