const { firestore } = require("../../services/firebase");
const criteriaCollection = firestore().collection("criteria");

class Criteria {
  constructor({
    criteriaId,
    criteriaName,
    criteriasObjects = {},
    criteriaProgram,
    criteriaTotalMark,
  }) {
    this.criteriaId = criteriaId || this.generateRandomId();
    this.criteriaName = criteriaName;
    this.criteriasObjects = criteriasObjects;
    this.criteriaProgram = criteriaProgram;
    this.criteriaTotalMark = criteriaTotalMark;
  }

  generateRandomId() {
    const randomPortion = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return randomPortion;
  }

  async save() {
    try {
      // Limitted to 1 criteria per program
      const querySnapshot = await criteriaCollection
        .where("criteriaProgram", "==", this.criteriaProgram)
        .get();

      if (!querySnapshot.empty) {
        // If a criteria for this program already exists, throw an error
        throw new Error("Criteria for this program already exists");
      }

      await criteriaCollection.doc(this.criteriaId).set({
        criteriaId: this.criteriaId,
        criteriaName: this.criteriaName,
        criteriasObjects: this.criteriasObjects,
        criteriaProgram: this.criteriaProgram,
        criteriaTotalMark: this.criteriaTotalMark,
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  static async getCriteriaByProgram(program) {
    try {
      const querySnapshot = await criteriaCollection
        .where("criteriaProgram", "==", program)
        .get();

      // Check if there is at least one document
      if (querySnapshot.size > 0) {
        // Return the data of the first document directly
        return querySnapshot.docs[0].data();
      } else {
        // Return null or handle the case where no documents are found
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  static async getAllCriteria() {
    try {
      const querySnapshot = await criteriaCollection.get();
      const criteria = [];
      querySnapshot.forEach((doc) => {
        criteria.push(doc.data());
      });
      return criteria;
    } catch (error) {
      throw error;
    }
  }

  // Delete a criteria by program
  static async deleteCriteriaByProgram(program) {
    try {
      const querySnapshot = await criteriaCollection
        .where("criteriaProgram", "==", program)
        .get();
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
      return;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Criteria;
