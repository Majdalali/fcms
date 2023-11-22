const { firestore } = require("../../services/firebase");
const meccCollection = firestore().collection("mcsdEvaluations");

class meccEvalSVModel {
  constructor({
    evaluationId,
    type = "Supervisor",
    evaluatorId,
    studentId,
    pmp = 0, // Project Management & Progress
    pp = 0, // Project Performance
    aor = 0, // Assessment of Report
    pfpd = 0, // Problem Formulation and Project Design 18 marks
    pac = 0, // Presentation and outcome
    finalMark = 0,
    remarksForCord,
    createdAt,
  }) {
    this.evaluationId = evaluationId || this.generateRandomId();
    this.type = type;
    this.evaluatorId = evaluatorId;
    this.studentId = studentId;
    this.pmp = pmp;
    this.pp = pp;
    this.aor = aor;
    this.pfpd = pfpd;
    this.pac = pac;
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
        pmp: this.pmp,
        pp: this.pp,
        aor: this.aor,
        pfpd: this.pfpd,
        pac: this.pac,
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
