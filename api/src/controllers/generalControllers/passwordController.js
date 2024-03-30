const Student = require("../../models/usersModels/studentModel");
const Lecturer = require("../../models/usersModels/lecturerModel");
const { createNotification } = require("./notificationsController");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function changePassword(io, connectedUsers, req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decoded.user_id;

    const { email, password } = req.body;

    const student = await Student.getUserByEmail(email);

    if (student) {
      const hashedPassword = await bcrypt.hash(password, 10);
      student.password = hashedPassword;
      // Update the project information using the new method

      await student.update();

      await createNotification({
        fromUser: userId,
        message: "Your password has been changed by the admin.",
        toUsers: [student.user_id],
        creator: "Admin",
        type: "General",
      });

      return res.status(200).json({
        message: `Password changed successfully for ${student.username}`,
      });
    }

    const lecturer = await Lecturer.getUserByEmail(email);

    if (lecturer) {
      const hashedPassword = await bcrypt.hash(password, 10);
      lecturer.password = hashedPassword;
      await lecturer.update();
      await createNotification({
        fromUser: userId,
        message: "Your password has been changed by the admin.",
        toUsers: [lecturer.user_id],
        creator: "Admin",
        type: "General",
      });
      return res.status(200).json({
        message: `Password changed successfully for ${lecturer.username}`,
      });
    }

    return res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { changePassword };
