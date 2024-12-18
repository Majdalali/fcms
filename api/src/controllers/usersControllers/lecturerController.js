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
  const {
    username,
    email,
    password,
    coordinator_program,
    isInvited,
    invitedBy,
  } = req.body;

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
      user_id: userRecord.uid,
      coordinator_program,
      isInvited,
      invitedBy,
      createdAt: new Date().toISOString(),
    });
    await newUser.save();
    await admin.auth().generateEmailVerificationLink(userRecord.email);
    // Remove password from the response
    const responseUser = { ...newUser };
    delete responseUser.password;

    return res
      .status(200)
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
        isCoordinator: user.isCoordinator,
        isChairMan: user.isChairMan,
        coordinator_program: user.coordinator_program,
      },
      secretKey,
      { expiresIn: "1 week" }
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
        coSupervisedStudents,
        isCoordinator,
        isChairMan,
        isInvited,
        invitedBy,
        isAdmin,
        createdAt,
      }) => ({
        user_id,
        username,
        email,
        isCoordinator,
        isChairMan,
        supervisedStudents,
        coSupervisedStudents,
        examinees,
        isInvited,
        invitedBy,
        isAdmin,
        createdAt,
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
        user_id: student.user_id,
        username: student.username,
        email: student.email,
        matricCard: student.matricCard,
        program: student.user_program,
        projectInfo: student.projectInfo,
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

async function myCoSupervisedStudents(req, res) {
  const { userId } = req.params;
  try {
    const user = await Lecturer.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "No Assigned students" });
    }
    const userSupervisedStudents = user.coSupervisedStudents;

    // Use Promise.all() with map() to fetch students asynchronously
    const studentPromises = userSupervisedStudents.map(async (studentId) => {
      const student = await Student.getUserById(studentId);
      const responseStudent = {
        user_id: student.user_id,
        username: student.username,
        email: student.email,
        matricCard: student.matricCard,
        program: student.user_program,
        projectInfo: student.projectInfo,
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

async function myExaminees(req, res) {
  const { userId } = req.params;
  try {
    const user = await Lecturer.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "No Assigned students" });
    }
    const userSupervisedStudents = user.examinees;

    // Use Promise.all() with map() to fetch students asynchronously
    const studentPromises = userSupervisedStudents.map(async (studentId) => {
      const student = await Student.getUserById(studentId);
      const responseStudent = {
        user_id: student.user_id,
        username: student.username,
        email: student.email,
        matricCard: student.matricCard,
        program: student.user_program,
        projectInfo: student.projectInfo,
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

async function updateLecturerDetails(req, res) {
  const { username, email, password, coordinator_program } = req.body;

  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decoded.user_id;
    // Find the student by ID
    const lecturer = await Lecturer.getUserById(userId);
    if (!lecturer) {
      return res.status(404).json({ error: "Lecturer not found" });
    }

    // Update the project information using the new method
    if (username !== undefined) {
      lecturer.username = username;
    }
    if (email !== undefined) {
      lecturer.email = email;
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      lecturer.password = hashedPassword;
    }
    if (coordinator_program !== undefined) {
      lecturer.coordinator_program = coordinator_program;
    }
    await lecturer.update();

    return res
      .status(200)
      .json({ message: "The lecturer details has been updated!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function makeUserAdmin(req, res) {
  const { email } = req.body;
  try {
    const user = await Lecturer.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isAdmin) {
      const username = user.username;
      return res.status(400).json({ error: `${username} is already an admin` });
    } else {
      const username = user.username;
      user.isAdmin = true;
      await user.update();
      return res.status(200).json({ message: `${username} is now an admin` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function changeUserPrivileges(req, res) {
  // change user privileges based on the privilege type provided e.g. admin, coordinator, super admin
  const { email, privilege } = req.body;

  try {
    const user = await Lecturer.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const username = user.username;

    switch (privilege) {
      case "admin":
        if (user.isAdmin) {
          return res
            .status(400)
            .json({ error: `${username} is already an admin` });
        } else {
          user.isAdmin = true;
          break;
        }
      case "coordinator":
        if (user.isCoordinator) {
          return res
            .status(400)
            .json({ error: `${username} is already a coordinator` });
        } else {
          user.isCoordinator = true;
          break;
        }
      case "chairman":
        if (user.isChairMan) {
          return res
            .status(400)
            .json({ error: `${username} is already a chairman` });
        } else {
          user.isChairMan = true;
          break;
        }

      default:
        return res
          .status(400)
          .json({ error: `Invalid privilege type: ${privilege}` });
    }

    await user.update();
    return res
      .status(200)
      .json({ message: `${username} is now a ${privilege}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteLecturer(req, res) {
  const { userId } = req.params;
  try {
    const user = await Lecturer.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.delete();
    return res.status(200).json({ message: "User deleted successfully" });
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
  myExaminees,
  myCoSupervisedStudents,
  updateLecturerExaminees,
  updateLecturerDetails,
  makeUserAdmin,
  changeUserPrivileges,
  deleteLecturer,
};
