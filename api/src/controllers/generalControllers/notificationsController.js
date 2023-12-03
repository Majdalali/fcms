const Notifications = require("../../models/generalModels/notificationsModel");
const jwt = require("jsonwebtoken");

async function createNotification(req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decoded.user_id;
    const { message } = req.body;

    const newNotification = new Notifications({
      userId,
      message,
      createdAt: new Date(),
    });

    await newNotification.save();

    res.status(201).json({
      message: "Notification created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllNotifications(req, res) {
  try {
    const notifications = await Notifications.getAllNotifications();

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteNotification(req, res) {
  const { notificationId } = req.params;

  try {
    await Notifications.deleteNotification(notificationId);

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getNotificationByUserId(req, res) {
  const { userId } = req.params;

  try {
    const notifications = await Notifications.getNotificationByUserId(userId);

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createNotification,
  getAllNotifications,
  deleteNotification,
  getNotificationByUserId,
};
