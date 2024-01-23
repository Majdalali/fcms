const Notifications = require("../../models/generalModels/notificationsModel");
const jwt = require("jsonwebtoken");

// async function createNotification(req, res) {
//   const token = req.headers.authorization;
//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
//     const fromUser = decoded.user_id;
//     const { message, toUsers, creator, type } = req.body;

//     const newNotification = new Notifications({
//       fromUser,
//       toUsers,
//       message,
//       creator,
//       type,
//       createdAt: new Date(),
//     });

//     await newNotification.save();

//     res.status(201).json({
//       message: "Notification created successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
async function createNotification({
  fromUser,
  message,
  toUsers,
  creator,
  type,
}) {
  try {
    const newNotification = new Notifications({
      fromUser,
      toUsers,
      message,
      creator,
      type,
      createdAt: new Date(),
    });

    await newNotification.save();
  } catch (error) {
    // Throw the error to be caught and handled by the calling function
    throw error;
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

// async function getNotificationByUserId(req, res) {
//   const { userId } = req.params;

//   try {
//     const notifications = await Notifications.getNotificationByUserId(userId);

//     if (!notifications || notifications.length === 0) {
//       return res.status(404).json({ message: "No notifications found" });
//     }

//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

async function getMyNotifications(req, res) {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
  const userId = decoded.user_id;
  try {
    // Retrieve notifications for the user
    const userNotifications = await Notifications.getNotificationsByUserId(
      userId
    );
    // Filter notifications that match the user's ID in the 'toUsers' array
    if (userNotifications.length === 0) {
      // Send a specific message if there are no notifications
      res.status(200).json({ message: "No notifications found for this user" });
    } else {
      // Send the filtered notifications as a response
      res.status(200).json(userNotifications);
    }
  } catch (error) {
    console.error("Error retrieving notifications:", error); // Log the actual error
    res.status(500).json({ error: "Failed to retrieve notifications" });
  }
}

module.exports = {
  createNotification,
  getAllNotifications,
  deleteNotification,
  getMyNotifications,
};
