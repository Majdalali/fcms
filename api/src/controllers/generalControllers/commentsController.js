const Comment = require("../../models/generalModels/commentsModel");
const jwt = require("jsonwebtoken");
const Lecturer = require("../../models/usersModels/lecturerModel");
const { createNotification } = require("./notificationsController");

async function createComment(io, connectedUsers, req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const lecturerId = decoded.user_id;
    const { commentContent, studentId } = req.body;

    const newComment = new Comment({
      commentContent,
      studentId,
      lecturerId,
      createdAt: new Date(),
    });

    await newComment.save();

    const userId = studentId;

    await createNotification({
      fromUser: lecturerId,
      message: "New comment from lecturer",
      toUsers: [studentId],
      creator: "Lecturer",
      type: "Comment",
    });
    const studentSocketId = connectedUsers[userId];
    if (studentSocketId) {
      io.to(studentSocketId).emit("notification", {
        message: "New comment from lecturer",
        // Additional data if needed
      });
    }

    res.status(200).json({
      message: "Comment created successfully",
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getLecturerComments(req, res) {
  const { lecturerId } = req.params;

  try {
    const lecturerComments = await Comment.getCommentsByLecturerId(lecturerId);

    if (!lecturerComments || lecturerComments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this lecturer" });
    }
    // add 10 seconds delay to simulate slow network
    res.status(200).json(lecturerComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// async function getMyLecturerComments(req, res) {
//   const token = req.headers.authorization;

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
//     const lecturerId = decoded.user_id;
//     const lecturerComments = await Comment.getCommentsByLecturerId(lecturerId);

//     if (!lecturerComments || lecturerComments.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "You haven't created any comments yet" });
//     }

//     res.status(200).json(lecturerComments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

async function getStudentComments(req, res) {
  const { studentId } = req.params;

  try {
    const studentComments = await Comment.getCommentsByStudentId(studentId);

    if (!studentComments || studentComments.length === 0) {
      return res
        .status(400)
        .json({ message: "No comments found for this student" });
    }
    const lecturerIds = studentComments.map((comment) => comment.lecturerId);
    const lecturerPromises = lecturerIds.map((lecturerId) =>
      Lecturer.getUserById(lecturerId)
    );

    const lecturerNames = await Promise.all(lecturerPromises);

    studentComments.forEach((comment, index) => {
      comment.lecturerName = lecturerNames[index].username; // Assuming lecturer name property is 'name', adjust as per your data model
    });

    res.status(200).json(studentComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteCommentById(req, res) {
  const { commentId } = req.params;
  try {
    await Comment.deleteCommentById(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    if (error.message === "Comment not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = {
  createComment,
  getLecturerComments,
  getStudentComments,
  deleteCommentById,
  //   getMyLecturerComments,
};
