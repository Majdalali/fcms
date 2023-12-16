const bcrypt = require("bcryptjs");
const userHandler = require("../../Handlers/lecturerHandler");
const Lecturer = require("../../models/usersModels/lecturerModel");
const Student = require("../../models/usersModels/studentModel");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_TOKEN;
const jwt = require("jsonwebtoken");
const admin = require("../../services/firebase");

async function registerLecturer(req, res) {
  const { username, email, password, user_type } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const existingUserByEmail = await Lecturer.getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password: hashedPassword,
      displayName: username, // Optionally set the display name
    });

    // Create a new user instance with hashed password
    const newUser = new Lecturer({
      username,
      email,
      password: hashedPassword,
      user_type,
      user_id: userRecord.uid,
    });
    await newUser.save();
    await admin.auth().generateEmailVerificationLink(userRecord.email);
    // Remove password from the response
    const responseUser = { ...newUser };
    delete responseUser.password;

    return res
      .status(201)
      .json({ message: "User registered successfully", user: responseUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function loginLecturer(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by matric card or email
    const user = await Lecturer.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // User is authenticated, send a success response
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_type: user.user_type,
        isAdmin: user.isAdmin,
      },
      secretKey,
      { expiresIn: "1h" }
    );
    // Remove password from the response
    const responseUser = { ...user };
    delete responseUser.password;

    return res
      .status(200)
      .json({ message: "Login successful", user: responseUser, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllLecturers(req, res) {
  try {
    const usersData = await userHandler.getAllUsers();
    const users = usersData.map((userData) => new Lecturer(userData)); // Convert data to User instances

    // Create a sanitized version of the users array without the password property
    const sanitizedUsers = users.map(
      ({
        user_id,
        username,
        email,
        supervisedStudents,
        examinees,
        department,
      }) => ({
        user_id,
        username,
        department,
        email,
        supervisedStudents,
        examinees,
      })
    );

    res.status(200).json(sanitizedUsers); // Send the sanitized array of User instances in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getLecturerById(req, res) {
  const { userId } = req.params;
  try {
    const user = await Lecturer.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Remove password from the response
    const responseUser = { ...user };
    delete responseUser.password;
    return res.status(200).json(responseUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getLecturerByEmail(req, res) {
  const { email } = req.body; // Get the email from the request body
  try {
    const user = await Lecturer.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Remove password from the response
    const responseUser = { ...user };
    delete responseUser.password;
    return res.status(200).json(responseUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getMyStudents(req, res) {
  const { userId } = req.params;
  try {
    const user = await Lecturer.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "No Assigned students" });
    }
    const userSupervisedStudents = user.supervisedStudents;

    // Use Promise.all() with map() to fetch students asynchronously
    const studentPromises = userSupervisedStudents.map(async (studentId) => {
      const student = await Student.getUserById(studentId);
      const responseStudent = {
        username: student.username,
        email: student.email,
        matricCard: student.matricCard,
      };

      return responseStudent; // Return the student object
    });

    // Wait for all promises to resolve using Promise.all()
    const students = await Promise.all(studentPromises);

    return res.status(200).json(students);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateLecturerExaminees(req, res) {
  const lecturerId = req.params.userId;
  const { studentId } = req.body; // Assuming you receive a student ID to add

  try {
    // Find the lecturer by ID
    const lecturer = await Lecturer.getUserById(lecturerId);
    if (!lecturer) {
      return res.status(404).json({ error: "Lecturer not found" });
    }

    if (!Array.isArray(studentId) || studentId.length === 0) {
      return res.status(400).json({ error: "No valid Student IDs provided" });
    }

    // If lecturer.examinees is undefined or not an array, initialize it as an empty array
    if (!Array.isArray(lecturer.examinees)) {
      lecturer.examinees = [];
    }

    // Check if the studentId already exists in the lecturer's examinees list
    const existingStudents = lecturer.examinees;
    const newStudents = [];
    let studentExists = false;

    for (const id of studentId) {
      if (!existingStudents.includes(id)) {
        newStudents.push(id);
      } else {
        studentExists = true;
      }
    }

    if (studentExists) {
      if (newStudents.length === 0) {
        return res
          .status(400)
          .json({ error: "Students has already been assigned to Examiner" });
      } else {
        await lecturer.updateExaminees(lecturer.examinees.concat(newStudents));
        return res
          .status(200)
          .json({ message: "Lecturer examinees updated successfully" });
      }
    } else {
      await lecturer.updateExaminees(lecturer.examinees.concat(newStudents));
      return res
        .status(200)
        .json({ message: "Lecturer examinees updated successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  registerLecturer,
  loginLecturer,
  getAllLecturers,
  getLecturerById,
  getLecturerByEmail,
  getMyStudents,
  updateLecturerExaminees,
};
