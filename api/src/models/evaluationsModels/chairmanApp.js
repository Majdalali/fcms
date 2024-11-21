const { firestore } = require("../../services/firebase");
const chairmanAppCollection = firestore().collection("chairmanApp");

class ChairmanApp {
  constructor({
    chairmanAppId,
    chairmanId,
    chairmanAppStudentId,
    chairmanAppDecision,
    chairmanAppSupportingDocuments = {},
    createdAt,
    matricNumber,
    studentName,
  }) {
    this.chairmanAppId = chairmanAppId || this.generateRandomId();
    this.chairmanId = chairmanId;
    this.chairmanAppStudentId = chairmanAppStudentId;
    this.chairmanAppDecision = chairmanAppDecision;
    this.chairmanAppSupportingDocuments = chairmanAppSupportingDocuments;
    this.createdAt = createdAt;
    this.matricNumber = matricNumber;
    this.studentName = studentName;
  }

  generateRandomId() {
    const randomPortion = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return randomPortion;
  }

  async save() {
    try {
      // Limitted to 1 criteria per program
      const querySnapshot = await chairmanAppCollection
        .where("chairmanAppStudentId", "==", this.chairmanAppStudentId)
        .get();

      if (!querySnapshot.empty) {
        // If a criteria for this program already exists, throw an error
        throw new Error("Chairman Application for this student already exists");
      }

      await chairmanAppCollection.doc(this.chairmanAppId).set({
        chairmanAppId: this.chairmanAppId,
        chairmanId: this.chairmanId,
        chairmanAppStudentId: this.chairmanAppStudentId,
        chairmanAppDecision: this.chairmanAppDecision,
        chairmanAppSupportingDocuments: this.chairmanAppSupportingDocuments,
        createdAt: this.createdAt,
        matricNumber: this.matricNumber,
        studentName: this.studentName,
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  static async getChairmanAppByStudentId(studentId) {
    try {
      const querySnapshot = await chairmanAppCollection
        .where("chairmanAppStudentId", "==", studentId)
        .get();

      if (querySnapshot.empty) {
        return null;
      }
      let chairmanApp;
      querySnapshot.forEach((doc) => {
        chairmanApp = doc.data();
      });
      return chairmanApp;
    } catch (error) {
      throw error;
    }
  }

  static async getAppByChairmanAppId(chairmanAppId) {
    try {
      const querySnapshot = await chairmanAppCollection
        .where("chairmanAppId", "==", chairmanAppId)
        .get();

      if (querySnapshot.empty) {
        return null;
      }
      let chairmanApp;
      querySnapshot.forEach((doc) => {
        chairmanApp = doc.data();
      });
      return chairmanApp;
    } catch (error) {
      throw error;
    }
  }

  static async getAllChairmanApps() {
    try {
      const querySnapshot = await chairmanAppCollection.get();
      const chairmanApps = [];
      querySnapshot.forEach((doc) => {
        const chairmanApp = doc.data();
        chairmanApps.push(chairmanApp);
      });
      return chairmanApps;
    } catch (error) {
      throw error;
    }
  }

  // update a chairman application
  async update() {
    try {
      await chairmanAppCollection.doc(this.chairmanAppId).update({
        chairmanAppId: this.chairmanAppId,
        chairmanAppDecision: this.chairmanAppDecision,
        chairmanAppSupportingDocuments: this.chairmanAppSupportingDocuments,
      });
      // return updated chairman application full details
      return;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ChairmanApp;
