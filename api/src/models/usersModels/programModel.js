const { firestore } = require("../../services/firebase");
const ProgramCollection = firestore().collection("programs");

class Program {
  constructor({ program_id, programTypes = {} }) {
    this.program_id = program_id || this.generateRandomId();
    this.programTypes = programTypes;
  }
  generateRandomId() {
    const randomPortion = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return randomPortion;
  }

  // only one instance of a program can exist
  async save() {
    try {
      const doc = await ProgramCollection.get();
      if (!doc.empty) {
        throw new Error("Only one instance can exist");
      } else {
        await ProgramCollection.doc(this.program_id).set({
          program_id: this.program_id,
          programTypes: this.programTypes,
        });
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async update() {
    try {
      await ProgramCollection.doc(this.program_id).update({
        programTypes: this.programTypes,
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  static async getThePrograms() {
    try {
      const querySnapshot = await ProgramCollection.get();
      if (querySnapshot.empty) {
        throw new Error("No programs found");
      } else {
        const programDoc = querySnapshot.docs[0]; // Access the first document directly
        if (!programDoc.exists) {
          throw new Error("Program document not found");
        }
        return programDoc.data();
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Program;
