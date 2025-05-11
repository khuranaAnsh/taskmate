import cron from "node-cron";
import Task from "../models/taskmodel.js";
import Notification from "../models/Notifiy.js";

const startReminderCron = () => {
  // Runs every 2 hours at 0th minute (e.g., 12:00, 2:00, 4:00...)
  cron.schedule("0 */2 * * *", async () => {
    try {
      const ongoingTasks = await Task.find({ status: "ongoing" });

      for (let task of ongoingTasks) {
        const message = `Reminder: Complete task "${task.title}"`;
        const notification = new Notification({
          userId: task.assignedTo,
          message,
          type: "reminder",
        });
        await notification.save();
      }

      console.log("Reminder notifications sent for ongoing tasks");
    } catch (err) {
      console.error("Cron job error:", err);
    }
  });
};

export default startReminderCron;
