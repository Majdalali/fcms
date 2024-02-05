const { firestore } = require("../../services/firebase");

class InternalExaminer {
  constructor({ name, email, phoneNumber, cvFileId }) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.cvFileId = cvFileId;
  }
  toPlainObject() {
    return {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      cvFileId: this.cvFileId,
    };
  }
}

class ExternalExaminer {
  constructor({ name, email, phoneNumber, institution, expertise, cvFileId }) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.institution = institution;
    this.expertise = expertise;
    this.cvFileId = cvFileId;
  }
  toPlainObject() {
    return {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      institution: this.institution,
      expertise: this.expertise,
      cvFileId: this.cvFileId,
    };
  }
}
class CoSupervisor {
  constructor({ name, email, phoneNumber }) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }
  toPlainObject() {
    return {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
    };
  }
}
class Student {
  constructor({
    name,
    email,
    utmEmail,
    phoneNumber,
    matricNumber,
    studentProgram,
    dissertationTitle,
    dissertationAbstract,
  }) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.utmEmail = utmEmail;
    this.studentProgram = studentProgram;
    this.matricNumber = matricNumber;
    this.dissertationTitle = dissertationTitle;
    this.dissertationAbstract = dissertationAbstract;
  }
  toPlainObject() {
    return {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      utmEmail: this.utmEmail,
      studentProgram: this.studentProgram,
      matricNumber: this.matricNumber,
      dissertationTitle: this.dissertationTitle,
      dissertationAbstract: this.dissertationAbstract,
    };
  }
}
class Nominations {
  constructor({
    nominationId,
    supervisorId,
    coSupervisors = [],
    student = {},
    internalExaminers = [],
    externalExaminers = [],
    passedDisserationTwo = false,
    passedElectivesAndCores = false,
    examinersNotified = false,
    createdAt,
    status = "status",
  }) {
    this.nominationId = nominationId || this.generateRandomId();
    this.supervisorId = supervisorId;
    this.coSupervisors = coSupervisors;
    this.student = student;
    this.internalExaminers = internalExaminers;
    this.externalExaminers = externalExaminers;
    this.passedDisserationTwo = passedDisserationTwo;
    this.passedElectivesAndCores = passedElectivesAndCores;
    this.examinersNotified = examinersNotified;
    this.createdAt = createdAt;
    this.status = status;
  }

  generateRandomId() {
    const randomPortion = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return randomPortion;
  }

  async save() {
    try {
      const nominationsRef = firestore().collection("nominations");
      await nominationsRef.doc(this.nominationId).set({
        nominationId: this.nominationId,
        supervisorId: this.supervisorId,
        coSupervisors: this.coSupervisors,
        student: this.student,
        internalExaminers: this.internalExaminers,
        externalExaminers: this.externalExaminers,
        passedDisserationTwo: this.passedDisserationTwo,
        passedElectivesAndCores: this.passedElectivesAndCores,
        examinersNotified: this.examinersNotified,
        createdAt: this.createdAt,
        status: this.status,
      });
      console.log("Nomination saved with ID: ", this.nominationId);
      return this.nominationId;
    } catch (error) {
      console.error("Error saving nomination: ", error);
      throw error;
    }
  }

  static formatNominationData(nominationData) {
    return {
      nominationId: nominationData.nominationId,
      status: nominationData.status,
      supervisorId: nominationData.supervisorId,
      supervisorName: nominationData.supervisorName,
      coSupervisors: nominationData.coSupervisors,
      student: nominationData.student,
      internalExaminers: nominationData.internalExaminers,
      externalExaminers: nominationData.externalExaminers,
      passedDisserationTwo: nominationData.passedDisserationTwo,
      passedElectivesAndCores: nominationData.passedElectivesAndCores,
      examinersNotified: nominationData.examinersNotified,
      createdAt: nominationData.createdAt,
    };
  }

  async update() {
    try {
      const nominationsRef = firestore().collection("nominations");
      await nominationsRef.doc(this.nominationId).update({
        status: this.status,
      });
      return this.nominationId;
    } catch (error) {
      console.error("Error updating nomination: ", error);
      throw error;
    }
  }

  static async getNominationById(nominationId) {
    try {
      const nominationsRef = firestore().collection("nominations");
      const nominationDoc = await nominationsRef.doc(nominationId).get();

      if (!nominationDoc.exists) {
        return null; // Return null if nomination not found
      }

      return nominationDoc.data();
    } catch (error) {
      console.error("Error getting nomination by ID: ", error);
      throw error;
    }
  }
  static async getAllNominations() {
    try {
      const nominationsRef = firestore().collection("nominations");
      const nominationsSnapshot = await nominationsRef.get();
      const nominations = [];
      nominationsSnapshot.forEach((doc) => {
        nominations.push(doc.data());
      });
      if (nominations.length === 0) {
        return null; // Return null if no nominations found
      }
      return nominations;
    } catch (error) {
      console.error("Error getting all nominations: ", error);
      throw error;
    }
  }
  static async getNominationsByProgram(program) {
    try {
      const nominationsRef = firestore().collection("nominations");
      const nominationsSnapshot = await nominationsRef
        .where("student.studentProgram", "==", program)
        .get();
      const nominations = [];
      nominationsSnapshot.forEach((doc) => {
        nominations.push(doc.data());
      });
      if (nominations.length === 0) {
        return null; // Return null if no nominations found
      }
      return nominations;
    } catch (error) {
      console.error("Error getting all nominations: ", error);
      throw error;
    }
  }
}
module.exports = {
  Nominations,
  InternalExaminer,
  ExternalExaminer,
  CoSupervisor,
  Student,
};
