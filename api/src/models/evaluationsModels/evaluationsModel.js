const { firestore } = require("../../services/firebase");
const evaluationsCollection = firestore().collection("evaluations");

class evaluationsModel {
  constructor({
    evaluationId,
    evaluatorId,
    studentId,
    evaluationObjects = {},
    remarksForCord,
    finalMark = {},
    grade,
    typeOfEvaluator,
    createdAt,
    lecturerName,
    studentName,
    matricNumber,
    projectType,
    criteriaProgram,
    supportingDocs = [],
    evalType,
  }) {
    this.evaluationId = evaluationId || this.generateRandomId();
    this.evaluatorId = evaluatorId;
    this.studentId = studentId;
    this.evaluationObjects = evaluationObjects;
    this.finalMark = finalMark;
    this.grade = grade;
    this.remarksForCord = remarksForCord;
    this.criteriaProgram = criteriaProgram;
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
    this.projectType = projectType;
    this.supportingDocs = supportingDocs;
    this.matricNumber = matricNumber;
    this.evalType = evalType;
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
        grade: this.grade,
        remarksForCord: this.remarksForCord,
        typeOfEvaluator: this.typeOfEvaluator,
        createdAt: this.createdAt,
        lecturerName: this.lecturerName,
        studentName: this.studentName,
        criteriaProgram: this.criteriaProgram,
        projectType: this.projectType,
        supportingDocs: this.supportingDocs,
        matricNumber: this.matricNumber,
        evalType: this.evalType,
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

  // Get evaluations by criteriaProgram
  static async getEvaluationsByProgram(criteriaProgram) {
    const querySnapshot = await evaluationsCollection
      .where("criteriaProgram", "==", criteriaProgram)
      .get();

    if (querySnapshot.empty) {
      return [];
    }

    const evaluations = querySnapshot.docs.map((doc) => doc.data());

    return evaluations;
  }

  static async getEvaluationsById(id) {
    const querySnapshot = await evaluationsCollection
      .where("studentId", "==", id)
      .get();

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

  static async getLecturerEvaluationsById(id) {
    const querySnapshot = await evaluationsCollection
      .where("evaluatorId", "==", id)
      .get();

    const evaluations = [];

    if (querySnapshot.empty) {
      return evaluations;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      evaluations.push(data);
    });

    return evaluations;
  }

  // Delete evaluation by id
  static async deleteEvaluationById(id) {
    try {
      await evaluationsCollection.doc(id).delete();
    } catch (error) {
      throw error;
    }
  }

  static async getEvaluationById(id) {
    try {
      const querySnapshot = await evaluationsCollection.doc(id).get();

      if (!querySnapshot.exists) {
        return null;
      }

      return querySnapshot.data();
    } catch (error) {
      throw error;
    }
  }

  static async getStudentEvaluationsByProjectType(id, projectType) {
    const querySnapshot = await evaluationsCollection
      .where("studentId", "==", id)
      .where("projectType", "==", projectType)
      .get();

    if (querySnapshot.empty) {
      return [];
    }

    const evaluations = querySnapshot.docs.map((doc) => doc.data());

    return evaluations;
  }
}

module.exports = evaluationsModel;
