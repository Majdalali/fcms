const { firestore } = require("../../services/firebase");
const evaluationsCollection = firestore().collection("Evaluations");

class evaluationsModel {
  constructor({
    evaluationId,
    evaluatorId,
    studentId,
    evaluationObjects = {},
    remarksForCord,
    finalMark = 0,
    typeOfEvaluator,
    createdAt,
    lecturerName,
    studentName,
  }) {
    this.evaluationId = evaluationId || this.generateRandomId();
    this.evaluatorId = evaluatorId;
    this.studentId = studentId;
    this.evaluationObjects = evaluationObjects;
    this.finalMark = finalMark;
    this.remarksForCord = remarksForCord;
    const allowedTypes = ["Supervisor", "Examiner", "Co-Supervisor"];
    if (!allowedTypes.includes(typeOfEvaluator)) {
      throw new Error(
        `Invalid type: ${typeOfEvaluator}. Must be either 'Supervisor', 'Co-Supervisor', or 'Examiner'.`
      );
    }
    this.typeOfEvaluator = typeOfEvaluator;
    this.createdAt = createdAt;
    this.lecturerName = lecturerName;
    this.studentName = studentName;
  }
  generateRandomId() {
    const randomPortion = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return randomPortion;
  }

  async save() {
    try {
      await evaluationsCollection.doc(this.evaluationId).set({
        evaluationId: this.evaluationId,
        evaluatorId: this.evaluatorId,
        studentId: this.studentId,
        evaluationObjects: this.evaluationObjects,
        finalMark: this.finalMark,
        remarksForCord: this.remarksForCord,
        typeOfEvaluator: this.typeOfEvaluator,
        createdAt: this.createdAt,
        lecturerName: this.lecturerName,
        studentName: this.studentName,
      });
    } catch (error) {
      throw error;
    }
  }
  static async getAllEvaluations() {
    try {
      const querySnapshot = await evaluationsCollection.get();

      if (querySnapshot.empty) {
        return [];
      }

      const evaluations = querySnapshot.docs.map((doc) => doc.data());

      return evaluations;
    } catch (error) {
      throw error;
    }
  }

  static async getEvaluationsById(id) {
    const EvaluationsCollection = firestore().collection("Evaluations");
    const querySnapshot = await EvaluationsCollection.where(
      "studentId",
      "==",
      id
    ).get();

    const evaluations = [];

    if (querySnapshot.empty) {
      const evaluatorSnapshot = await EvaluationsCollection.where(
        "evaluatorId",
        "==",
        id
      ).get();

      if (evaluatorSnapshot.empty) {
        return evaluations;
      }

      evaluatorSnapshot.forEach((doc) => {
        const data = doc.data();
        evaluations.push(data);
      });
    } else {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        evaluations.push(data);
      });
    }

    return evaluations;
  }
}

module.exports = evaluationsModel;
