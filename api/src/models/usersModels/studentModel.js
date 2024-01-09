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
    projectInfo = {},
    coSupervisors = [],
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
    this.coSupervisors = coSupervisors;
    this.projectInfo = projectInfo;
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
        coSupervisors: this.coSupervisors,
        projectInfo: this.projectInfo,
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
        coSupervisors: this.coSupervisors,
        projectInfo: this.projectInfo,
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

  async updateCoSupervisors(coSupervisors) {
    try {
      const updatedData = {};

      // Check if coSupervisors array is defined and not empty before updating
      if (
        coSupervisors &&
        Array.isArray(coSupervisors) &&
        coSupervisors.length > 0
      ) {
        updatedData.coSupervisors = coSupervisors;
      } else {
        throw new Error("Co-supervisors data is invalid");
      }

      await userCollection.doc(this.user_id).update(updatedData);
    } catch (error) {
      throw error;
    }
  }

  async updateProjectInfo(projectInfo) {
    try {
      // Check if projectInfo is defined and is an object before updating
      if (
        projectInfo &&
        typeof projectInfo === "object" &&
        Object.keys(projectInfo).length > 0
      ) {
        await userCollection.doc(this.user_id).update({
          projectInfo: projectInfo,
        });
      } else {
        throw new Error("Project information is invalid");
      }
    } catch (error) {
      throw error;
    }
  }

  static async getAllStudentsByProgram(program) {
    try {
      const users = [];
      const querySnapshot = await userCollection
        .where("user_program", "==", program)
        .get();
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      if (users.length === 0) {
        return null;
      }
      return users;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Student;
