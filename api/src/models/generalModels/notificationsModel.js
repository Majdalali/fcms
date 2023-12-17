const { firestore } = require("../../services/firebase");
const notificationsCollection = firestore().collection("notifications");
const short = require("short-uuid");

class Notifications {
  constructor({
    notificationId,
    fromUser,
    toUsers = [],
    message,
    creator,
    type,
    createdAt,
  }) {
    this.notificationId = notificationId || short.generate();
    this.fromUser = fromUser;
    this.toUsers = toUsers;
    this.message = message;
    this.creator = creator;
    this.type = type;
    this.createdAt = createdAt;
  }

  async save() {
    try {
      await notificationsCollection.doc(this.notificationId).set({
        notificationId: this.notificationId,
        fromUser: this.fromUser,
        toUsers: this.toUsers,
        message: this.message,
        creator: this.creator,
        type: this.type,
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

  static async getNotificationsByUserId(userId) {
    try {
      const querySnapshot = await notificationsCollection
        .where("toUsers", "array-contains", userId)
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
