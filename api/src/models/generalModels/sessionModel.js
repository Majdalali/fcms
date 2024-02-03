const { firestore } = require("../../services/firebase");
const sessionCollection = firestore().collection("sessions");

class Session {
  constructor({
    session_id,
    session_title,
    session_semester,
    progress_one = {},
    progress_two = {},
    finalSubmission = {},
    proposal = {},
    presentationAndDemo = {},
    correction = {},
    createdAt,
    bypass_deadline = false,
  }) {
    this.session_id = session_id || this.generateRandomId();
    this.session_title = session_title;
    this.session_semester = session_semester;
    this.progress_one = progress_one;
    this.progress_two = progress_two;
    this.finalSubmission = finalSubmission;
    this.presentationAndDemo = presentationAndDemo;
    this.proposal = proposal;
    this.correction = correction;
    this.createdAt = createdAt;
    this.bypass_deadline = bypass_deadline;
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
        presentationAndDemo: this.presentationAndDemo,
        createdAt: this.createdAt,
        bypass_deadline: this.bypass_deadline,
      });
    } catch (error) {
      throw error;
    }
  }

  static async getSessionById(sessionId) {
    try {
      const session = await sessionCollection.doc(sessionId).get();
      if (!session.exists) {
        return null;
      }
      return session.data();
    } catch (error) {
      throw error;
    }
  }
  static async getLatestSession() {
    try {
      const querySnapshot = await sessionCollection
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      let latestSession = null;
      querySnapshot.forEach((doc) => {
        const sessionData = doc.data();
        latestSession = new Session({
          session_title: sessionData.session_title,
          session_semester: sessionData.session_semester,
          proposal: sessionData.proposal,
          progress_one: sessionData.progress_one,
          progress_two: sessionData.progress_two,
          finalSubmission: sessionData.finalSubmission,
          presentationAndDemo: sessionData.presentationAndDemo,
          correction: sessionData.correction,
          bypass_deadline: sessionData.bypass_deadline,
        });
      });

      return latestSession;
    } catch (error) {
      throw error;
    }
  }

  static async getAllSessions() {
    // without creating a new instance of the class
    try {
      const querySnapshot = await sessionCollection.get();
      const sessions = [];
      querySnapshot.forEach((doc) => {
        const sessionData = doc.data();
        sessions.push(sessionData);
      });
      return sessions;
    } catch (error) {
      throw error;
    }
  }

  static async updateSessionBypass(sessionId, bypass_deadline) {
    try {
      await sessionCollection.doc(sessionId).update({
        bypass_deadline,
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteSession(sessionId) {
    // check if session exists
    try {
      const session = await sessionCollection.doc(sessionId).get();
      if (!session.exists) {
        return null;
      }
      await sessionCollection.doc(sessionId).delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Session;
