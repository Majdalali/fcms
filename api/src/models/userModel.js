// models/user.js
const { firestore } = require("../services/firebase");
const userCollection = firestore().collection("users");
const userHandler = require("../handlers/userHandler");
class User {
  constructor({
    username,
    email,
    matricCard,
    password,
    user_type = "student",
    user_id = null,
  }) {
    this.user_id = user_id || this.generateRandomId(); // Generates a new random ID if user_id is not provided
    this.username = username;
    this.matricCard = matricCard;
    this.email = email;
    this.password = password;
    this.user_type = user_type;
  }

  generateRandomId() {
    const timestamp = Date.now().toString(); // Current timestamp in milliseconds
    const randomPortion = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return timestamp + randomPortion;
  }

  static async getUserByEmail(email) {
    const userData = await userHandler.getUserByEmail(email);
    if (!userData) {
      return null;
    }
    return new User(userData);
  }

  static async getUserById(userId) {
    const userData = await userHandler.getUserById(userId);
    if (!userData) {
      return null;
    }
    return new User(userData);
  }

  static async getUserByEmailOrMatric(email, matricCard) {
    const userData = await userHandler.getUserByEmailOrMatric(
      email,
      matricCard
    );
    if (!userData) {
      return null;
    }
    return new User(userData);
  }

  async save() {
    try {
      await userCollection.doc(this.user_id).set({
        user_id: this.user_id,
        username: this.username,
        email: this.email,
        matricCard: this.matricCard,
        password: this.password,
        user_type: this.user_type,
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
