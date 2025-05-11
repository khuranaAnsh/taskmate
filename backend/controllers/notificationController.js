import Notification from "../models/Notifiy.js";

export const createNotification = async (userId, message, type) => {
  try {
    console.log("Creating notification:", { userId, message, type });
    const notification = new Notification({ userId, message, type });
    await notification.save();
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications for user:", req.user.id);
    console.log("User ID:", req.user.id);
    console.log("User role:", req.user.role);

    const notifications = await Notification.find({ userId: req.user.id }).sort(
      { createdAt: -1 }
    );
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
