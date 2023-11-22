const { firestore } = require("../../services/firebase");
const meccCollection = firestore().collection("meccEvaluations");

class meccEvalSVModel {
  constructor({
    evaluationId,
    type = "Supervisor",
    evaluatorId,
    studentId,
    pmpone = 0, // Project Management & Progress I
    pmptwo = 0, // Project Management & Progress II
    pp = 0, // Project Performance
    aor = 0, // Assessment of Report
    pic = 0, // Project Ideas communication
    ps = 0, // Personal Skills
    finalMark = 0,
    createdAt,
  }) {
    this.evaluationId = evaluationId || this.generateRandomId();
    this.type = type;
    this.evaluatorId = evaluatorId;
    this.studentId = studentId;
    this.pmpone = pmpone;
    this.pmptwo = pmptwo;
    this.pp = pp;
    this.aor = aor;
    this.pic = pic;
    this.ps = ps;
    this.finalMark = finalMark;
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
        pmpone: this.pmpone,
        pmptwo: this.pmptwo,
        pp: this.pp,
        aor: this.aor,
        pic: this.pic,
        ps: this.ps,
        finalMark: this.finalMark,
        createdAt: this.createdAt,
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = meccEvalSVModel;
