const { firestore } = require("../services/firebase");

class Examiner {
  constructor({ name, email, phoneNumber, institution, expertise }) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.institution = institution;
    this.expertise = expertise;
  }
  toPlainObject() {
    return {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      institution: this.institution,
      expertise: this.expertise,
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
    dissertationTitle,
    dissertationAbstract,
  }) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.utmEmail = utmEmail;
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
      });
      console.log("Nomination saved with ID: ", this.nominationId);
      return this.nominationId;
    } catch (error) {
      console.error("Error saving nomination: ", error);
      throw error;
    }
  }

  static formatNominationData(nominationData) {
    const createdAt = new Date(
      nominationData.createdAt._seconds * 1000 +
        nominationData.createdAt._nanoseconds / 1000000
    );
    return {
      nominationId: nominationData.nominationId,
      supervisorId: nominationData.supervisorId,
      coSupervisors: nominationData.coSupervisors,
      student: nominationData.student,
      internalExaminers: nominationData.internalExaminers,
      externalExaminers: nominationData.externalExaminers,
      passedDisserationTwo: nominationData.passedDisserationTwo,
      passedElectivesAndCores: nominationData.passedElectivesAndCores,
      examinersNotified: nominationData.examinersNotified,
      createdAt: createdAt.toUTCString(),
    };
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
}
module.exports = {
  Nominations,
  Examiner,
  CoSupervisor,
  Student,
};
