const { firestore } = require("../../services/firebase");
const sessionCollection = firestore().collection("sessions");

class Session {
  constructor({
    session_id,
    session_title,
    session_semester,
    progress_one,
    progress_two,
    finalSubmission,
    proposal,
    correction,
  }) {
    this.session_id = session_id || this.generateRandomId();
    this.session_title = session_title;
    this.session_semester = session_semester;
    this.progress_one = progress_one;
    this.progress_two = progress_two;
    this.finalSubmission = finalSubmission;
    this.proposal = proposal;
    this.correction = correction;
  }
  generateRandomId() {
    const randomPortion = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return randomPortion;
  }

  async save() {
    try {
      await sessionCollection.doc(this.session_id).set({
        session_id: this.session_id,
        session_title: this.session_title,
        session_semester: this.session_semester,
        progress_one: this.progress_one,
        progress_two: this.progress_two,
        finalSubmission: this.finalSubmission,
        proposal: this.proposal,
        correction: this.correction,
      });
    } catch (error) {
      throw error;
    }
  }

  static async getSession(sessionTitle) {
    try {
      const querySnapshot = await sessionCollection
        .where("session_title", "==", sessionTitle)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const sessionData = querySnapshot.docs[0].data();
      const session = new Session({
        session_title: sessionData.session_title,
        session_semester: sessionData.session_semester,
        proposal: sessionData.proposal,
        progress_one: sessionData.progress_one,
        progress_two: sessionData.progress_two,
        finalSubmission: sessionData.finalSubmission,
        correction: sessionData.correction,
      });

      return session;
    } catch (error) {
      throw error;
    }
  }

  static async deleteSession(sessionId) {
    try {
      await sessionCollection.doc(sessionId).delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Session;
