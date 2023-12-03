const { firestore } = require("../../services/firebase");
const notificationsCollection = firestore().collection("notifications");
const short = require("short-uuid");

class Notifications {
  constructor({ notificationId, userId, message, createdAt }) {
    this.notificationId = notificationId || short.generate();
    this.userId = userId;
    this.message = message;
    this.createdAt = createdAt;
  }

  async save() {
    try {
      await notificationsCollection.doc(this.notificationId).set({
        notificationId: this.notificationId,
        userId: this.userId,
        message: this.message,
        createdAt: this.createdAt,
      });
    } catch (error) {
      throw error;
    }
  }
  static async getAllNotifications() {
    try {
      const querySnapshot = await notificationsCollection.get();

      const notifications = [];
      querySnapshot.forEach((doc) => {
        const notificationData = doc.data();
        notifications.push(notificationData);
      });

      return notifications;
    } catch (error) {
      throw error;
    }
  }

  static async deleteNotification(notificationId) {
    try {
      await notificationsCollection.doc(notificationId).delete();
    } catch (error) {
      throw error;
    }
  }

  static async getNotificationByUserId(userId) {
    try {
      const querySnapshot = await notificationsCollection
        .where("userId", "==", userId)
        .get();

      const notifications = [];
      querySnapshot.forEach((doc) => {
        const notificationData = doc.data();
        notifications.push(notificationData);
      });

      return notifications;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Notifications;
