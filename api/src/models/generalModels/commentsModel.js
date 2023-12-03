const { firestore } = require("../../services/firebase");
const commentsCollection = firestore().collection("comments");

class Comment {
  constructor({ commentId, commentContent, studentId, lecturerId, createdAt }) {
    this.commentId = commentId || this.generateRandomId();
    this.commentContent = commentContent;
    this.studentId = studentId;
    this.lecturerId = lecturerId;
    this.createdAt = createdAt;
  }
  generateRandomId() {
    const randomPortion = Math.floor(Math.random() * 100000).toString(); // Random 5-digit number
    return randomPortion;
  }

  async save() {
    try {
      await commentsCollection.doc(this.commentId).set({
        commentId: this.commentId,
        commentContent: this.commentContent,
        studentId: this.studentId,
        lecturerId: this.lecturerId,
        createdAt: this.createdAt,
      });
    } catch (error) {
      throw error;
    }
  }
  static async getCommentsByLecturerId(lecturerId) {
    try {
      const querySnapshot = await commentsCollection
        .where("lecturerId", "==", lecturerId)
        .get();

      const comments = [];
      querySnapshot.forEach((doc) => {
        const commentData = doc.data();
        comments.push(commentData);
      });

      return comments;
    } catch (error) {
      throw error;
    }
  }

  static async getCommentsByStudentId(studentId) {
    try {
      const querySnapshot = await commentsCollection
        .where("studentId", "==", studentId)
        .get();

      const comments = [];
      querySnapshot.forEach((doc) => {
        const commentData = doc.data();
        comments.push(commentData);
      });

      return comments;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Comment;
