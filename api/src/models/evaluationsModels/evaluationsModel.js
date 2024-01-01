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
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = evaluationsModel;
