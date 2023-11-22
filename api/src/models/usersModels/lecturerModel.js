// models/user.js
const { firestore } = require("../../services/firebase");
const lecturerCollection = firestore().collection("lecturers");
const userHandler = require("../../Handlers/lecturerHandler");
class Lecturer {
  constructor({
    username,
    email,
    password,
    user_type = "lecturer",
    user_id = null,
    supervisedStudents = [],
  }) {
    this.user_id = user_id || this.generateRandomId(); // Generates a new random ID if user_id is not provided
    this.username = username;
    this.email = email;
    this.password = password;
    this.user_type = user_type;
    this.supervisedStudents = supervisedStudents;
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
    return new Lecturer(userData);
  }

  static async getUserById(userId) {
    const userData = await userHandler.getUserById(userId);
    if (!userData) {
      return null;
    }
    return new Lecturer(userData);
  }

  static async getUserByEmailOrMatric(email, matricCard) {
    const userData = await userHandler.getUserByEmailOrMatric(
      email,
      matricCard
    );
    if (!userData) {
      return null;
    }
    return new Lecturer(userData);
  }

  async addSupervisedStudent(studentId) {
    try {
      // Check if the student is already in the supervisedStudents array
      if (!this.supervisedStudents.includes(studentId)) {
        this.supervisedStudents.push(studentId);
        await this.save();
      }
    } catch (error) {
      throw error;
    }
  }

  async save() {
    try {
      await lecturerCollection.doc(this.user_id).set({
        user_id: this.user_id,
        username: this.username,
        email: this.email,
        password: this.password,
        user_type: this.user_type,
        supervisedStudents: this.supervisedStudents,
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Lecturer;
