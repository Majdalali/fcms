const { firestore } = require("../../services/firebase");
const meccCollection = firestore().collection("meccEvaluations");

class meccEvalSVModel {
  constructor({
    evaluationId,
    type = "Examiner",
    evaluatorId,
    studentId,
    aor = 0, // Assessment of Report
    presentationMark = 0, // presentation (CLO3 - 10%)
    finalMark = 0,
    remarksForCord,
    createdAt,
  }) {
    this.evaluationId = evaluationId || this.generateRandomId();
    this.type = type;
    this.evaluatorId = evaluatorId;
    this.studentId = studentId;
    this.aor = aor;
    this.presentationMark = presentationMark;
    this.finalMark = finalMark;
    this.remarksForCord = remarksForCord;
    this.createdAt = createdAt;
  }
  generateRandomId() {
    const randomPortion = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return randomPortion;
  }

  async save() {
    try {
      await meccCollection.doc(this.evaluationId).set({
        evaluationId: this.evaluationId,
        type: this.type,
        evaluatorId: this.evaluatorId,
        studentId: this.studentId,
        aor: this.aor,
        presentationMark: this.presentationMark,
        finalMark: this.finalMark,
        remarksForCord: this.remarksForCord,
        createdAt: this.createdAt,
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = meccEvalSVModel;
