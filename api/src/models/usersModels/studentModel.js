// models/user.js
const { firestore } = require("../../services/firebase");
const userCollection = firestore().collection("students");
const userHandler = require("../../Handlers/studentHandler");
class Student {
  constructor({
    username,
    email,
    matricCard,
    password,
    user_type = "student",
    user_program,
    isActivated = false,
    user_id = null,
    supervisor = null,
    examiners = [],
  }) {
    this.user_id = user_id; // Generates a new random ID if user_id is not provided
    this.username = username;
    this.matricCard = matricCard;
    this.email = email;
    this.password = password;
    this.user_type = user_type;
    this.user_program = user_program;
    this.isActivated = isActivated;
    this.supervisor = supervisor;
    this.examiners = examiners;
  }

  static async getUserByEmail(email) {
    const userData = await userHandler.getUserByEmail(email);
    if (!userData) {
      return null;
    }
    return new Student(userData);
  }

  static async getUserById(userId) {
    const userData = await userHandler.getUserById(userId);
    if (!userData) {
      return null;
    }
    return new Student(userData);
  }

  static async getUserByEmailOrMatric(email, matricCard) {
    const userData = await userHandler.getUserByEmailOrMatric(
      email,
      matricCard
    );
    if (!userData) {
      return null;
    }
    return new Student(userData);
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
        user_program: this.user_program,
        isActivated: this.isActivated,
        supervisor: this.supervisor,
        examiners: this.examiners,
      });
    } catch (error) {
      throw error;
    }
  }

  // Update the user data in the database
  async update() {
    try {
      await userCollection.doc(this.user_id).update({
        username: this.username,
        email: this.email,
        matricCard: this.matricCard,
        password: this.password,
        user_type: this.user_type,
        user_program: this.user_program,
        isActivated: this.isActivated,
        supervisor: this.supervisor,
        examiners: this.examiners,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateExaminers(examiners) {
    try {
      const updatedData = {};

      // Check if examiners array is defined and not empty before updating
      if (examiners && Array.isArray(examiners) && examiners.length > 0) {
        updatedData.examiners = examiners;
      } else {
        throw new Error("Examiners data is invalid");
      }

      await userCollection.doc(this.user_id).update(updatedData);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Student;
