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
    type,
    createdAt,
  }) {
    this.evaluationId = evaluationId || this.generateRandomId();
    this.evaluatorId = evaluatorId;
    this.studentId = studentId;
    this.evaluationObjects = evaluationObjects;
    this.finalMark = finalMark;
    this.remarksForCord = remarksForCord;
    const allowedTypes = ["Supervisor", "Examiner"];
    if (!allowedTypes.includes(type)) {
      throw new Error(
        `Invalid type: ${type}. Must be either 'Supervisor' or 'Examiner'.`
      );
    }
    this.type = type;
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
        type: this.type,
        createdAt: this.createdAt,
      });
      console.log("Evaluation has been created");
      console.log("Evaluation id: ", this.evaluationId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = evaluationsModel;
