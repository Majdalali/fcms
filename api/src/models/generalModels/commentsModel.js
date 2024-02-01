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

  // Delete commnet by commentId
  static async deleteCommentById(commentId) {
    try {
      // get comment by commentId
      const comment = await commentsCollection.doc(commentId).get();
      if (!comment.exists) {
        throw new Error("Comment not found");
      }
      // delete comment
      await commentsCollection.doc(commentId).delete();
    } catch (error) {
      console.error("Error deleting comment by ID:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  }
}

module.exports = Comment;
