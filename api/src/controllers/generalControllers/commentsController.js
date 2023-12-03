const Comment = require("../../models/generalModels/commentsModel");
const jwt = require("jsonwebtoken");

async function createComment(req, res) {
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

    res.status(201).json({
      message: "Comment created successfully",
    });
  } catch (error) {
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
        .status(404)
        .json({ message: "No comments found for this student" });
    }

    res.status(200).json(studentComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createComment,
  getLecturerComments,
  getStudentComments,
  //   getMyLecturerComments,
};
