// models/notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["info", "warning", "reminder"],
    default: "info",
  },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
