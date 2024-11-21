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
    examinees = [],
    coSupervisedStudents = [],
    isAdmin = false,
    isCoordinator = false,
    isChairMan = false,
    coordinator_program = null,
    isInvited = false,
    invitedBy = null,
    createdAt,
  }) {
    this.user_id = user_id; // Generates a new random ID if user_id is not provided
    this.username = username;
    this.email = email;
    this.password = password;
    this.user_type = user_type;
    this.isAdmin = isAdmin;
    this.isCoordinator = isCoordinator;
    this.isChairMan = isChairMan;
    this.examinees = examinees;
    this.supervisedStudents = supervisedStudents;
    this.coSupervisedStudents = coSupervisedStudents;
    this.coordinator_program = coordinator_program;
    this.isInvited = isInvited;
    this.invitedBy = invitedBy;
    this.createdAt = createdAt;
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
        examinees: this.examinees,
        isAdmin: this.isAdmin,
        isCoordinator: this.isCoordinator,
        isChairMan: this.isChairMan,
        supervisedStudents: this.supervisedStudents,
        coSupervisedStudents: this.coSupervisedStudents,
        coordinator_program: this.coordinator_program,
        isInvited: this.isInvited,
        invitedBy: this.invitedBy,
        createdAt: this.createdAt,
      });
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      await lecturerCollection.doc(this.user_id).update({
        username: this.username,
        email: this.email,
        password: this.password,
        user_type: this.user_type,
        examinees: this.examinees,
        supervisedStudents: this.supervisedStudents,
        coSupervisedStudents: this.coSupervisedStudents,
        isAdmin: this.isAdmin,
        isCoordinator: this.isCoordinator,
        isChairMan: this.isChairMan,
        coordinator_program: this.coordinator_program,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateExaminees(examinees) {
    try {
      const updatedData = {};

      // Check if examinees array is defined and not empty before updating
      if (examinees && Array.isArray(examinees) && examinees.length > 0) {
        updatedData.examinees = examinees;
      } else {
        throw new Error("Examinees data is invalid");
      }

      await lecturerCollection.doc(this.user_id).update(updatedData);
    } catch (error) {
      // Log the error details to check the specific issue
      console.error("Update Examinees Error:", error);
      throw error;
    }
  }

  async delete() {
    try {
      await lecturerCollection.doc(this.user_id).delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Lecturer;
