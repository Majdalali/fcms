const bcrypt = require("bcryptjs");
const Student = require("../../models/usersModels/studentModel");
const Lecturer = require("../../models/usersModels/lecturerModel");
const userHandler = require("../../Handlers/studentHandler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_TOKEN;
const admin = require("../../services/firebase");

async function registerUser(req, res) {
  const { username, email, password, user_type, matricCard, user_program } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUserByEmail = await Student.getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password: hashedPassword,
      displayName: username, // Optionally set the display name
    });

    const newUser = new Student({
      username,
      email,
      password: hashedPassword,
      matricCard: matricCard || null,
      user_type,
      user_program,
      user_id: userRecord.uid, // Use Firebase UID as your user ID
    });

    await newUser.save();

    await admin.auth().generateEmailVerificationLink(email);

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function loginUser(req, res) {
  const { email, matricCard, password } = req.body;

  try {
    const user = await Student.getUserByEmailOrMatric(email, matricCard);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid matric card or email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid matric card or email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_type: user.user_type,
        user_program: user.user_program,
      },
      secretKey,
      { expiresIn: "1 week" }
    );

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

async function getAllUsers(req, res) {
  try {
    const usersData = await userHandler.getAllUsers();
    const users = usersData.map((userData) => new Student(userData)); // Convert data to User instances

    // Create a sanitized version of the users array without the password property
    const sanitizedUsers = users.map(
      ({
        user_id,
        username,
        email,
        matricCard,
        user_type,
        supervisor,
        examiners,
        user_program,
        projectInfo,
        coSupervisors,
      }) => ({
        user_id,
        username,
        email,
        matricCard,
        user_type,
        supervisor,
        examiners,
        user_program,
        projectInfo,
        coSupervisors,
      })
    );

    res.status(200).json(sanitizedUsers); // Send the sanitized array of User instances in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllProjects(req, res) {
  try {
    const usersData = await userHandler.getAllUsers();
    const users = usersData.map((userData) => new Student(userData)); // Convert data to User instances

    // Create a sanitized version of the users array without the password property
    const sanitizedUsers = users.map(
      ({ user_id, username, email, user_program, projectInfo }) => ({
        user_id,
        username,
        email,
        user_program,
        projectInfo,
      })
    );

    res.status(200).json(sanitizedUsers); // Send the sanitized array of User instances in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserById(req, res) {
  const { userId } = req.params;
  try {
    const user = await Student.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found 4" });
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

async function getStudent(req, res) {
  const { userId } = req.params;
  try {
    const user = await Student.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found 4" });
    }
    // Remove password from the response
    const responseUser = {
      name: user.username,
      email: user.email,
    };
    return res.status(200).json(responseUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserByEmail(req, res) {
  const { email } = req.body; // Get the email from the request body
  try {
    const user = await Student.getUserByEmail(email);
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

async function assignSupervisor(req, res) {
  const { email } = req.body;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
  const studentId = decoded.user_id;

  try {
    // Find the supervisor by email
    const supervisor = await Lecturer.getUserByEmail(email);

    if (!supervisor || supervisor.user_type !== "lecturer") {
      return res.status(404).json({ error: "Supervisor not found" });
    }

    // Assign the supervisor to the student
    const student = await Student.getUserById(studentId);

    if (student.supervisor) {
      return res
        .status(400)
        .json({ error: "Student already has a supervisor" });
    }

    // Update student's supervisor field with the supervisor's ID
    student.supervisor = supervisor.user_id;

    // Add the student to the supervisor's supervisedStudents array
    const lecturer = new Lecturer(supervisor);
    await lecturer.addSupervisedStudent(student.user_id);

    // Save the updated student and lecturer data
    await student.save();
    await lecturer.save();
    const supervisorresponse = await Lecturer.getUserById(student.supervisor);
    const supervisorDetails = {
      name: supervisorresponse.username,
      email: supervisorresponse.email,
    };
    // Return success response
    return res
      .status(200)
      .json({ message: "Supervisor assigned successfully", supervisorDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getSupervisorDetails(req, res) {
  const studentId = req.params.studentId;

  try {
    // Find the student by ID
    const student = await Student.getUserById(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if the student has a supervisor
    if (!student.supervisor) {
      return res
        .status(404)
        .json({ error: "Student does not have a supervisor" });
    }

    // Find the supervisor by ID
    const supervisor = await Lecturer.getUserById(student.supervisor);

    if (!supervisor) {
      return res.status(404).json({ error: "Supervisor not found" });
    }

    // Extract and send supervisor details (name and email) in the response
    const supervisorDetails = {
      name: supervisor.username,
      email: supervisor.email,
    };

    return res.status(200).json(supervisorDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function getExaminersDetails(req, res) {
  const { userId } = req.params;
  try {
    const user = await Lecturer.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "Examiner not found" });
    }
    // Remove password from the response
    const responseUser = { name: user.username, email: user.email };
    return res.status(200).json(responseUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateStudentExaminers(req, res) {
  const studentId = req.params.userId;
  const { examinerId } = req.body; // Assuming you receive an array of examiner IDs

  try {
    // Find the student by ID
    const student = await Student.getUserById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (!Array.isArray(examinerId) || examinerId.length === 0) {
      return res.status(400).json({ error: "No valid examiner IDs provided" });
    }

    // If student.examiners is undefined or not an array, initialize it as an empty array
    if (!Array.isArray(student.examiners)) {
      student.examiners = [];
    }

    const updateExamineesPromises = examinerId.map(async (id) => {
      const examiner = await Lecturer.getUserById(id);
      if (examiner) {
        if (!Array.isArray(examiner.examinees)) {
          examiner.examinees = [];
        }
        if (!examiner.examinees.includes(studentId)) {
          examiner.examinees.push(studentId);
          await examiner.updateExaminees(examiner.examinees); // Update the examinees list
        }
      }
    });

    await Promise.all(updateExamineesPromises);

    // Check if any of the received examinerIds already exist in the student's examiners list
    const existingExaminers = student.examiners;
    const newExaminers = examinerId.filter(
      (id) => !existingExaminers.includes(id)
    );

    if (newExaminers.length === 0) {
      return res
        .status(400)
        .json({ error: "Examiners have already been assigned to the student" });
    }

    await student.updateExaminers(student.examiners.concat(newExaminers));

    return res.status(200).json({
      message: "Student examiners and lecturer examinees updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateStudentCoSupervisors(req, res) {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
  const studentId = decoded.user_id;
  const { email } = req.body;

  try {
    // Find the student by ID
    const student = await Student.getUserById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the supervisor by email
    const supervisor = await Lecturer.getUserByEmail(email);
    if (!supervisor || supervisor.user_type !== "lecturer") {
      return res.status(404).json({ error: "Supervisor not found" });
    }

    // Check if the supervisor already exists in student's coSupervisors
    if (student.coSupervisors.includes(supervisor.user_id)) {
      return res.status(400).json({
        error: "Supervisor already assigned as co-supervisor to student",
      });
    }
    if (!supervisor.coSupervisedStudents.includes(studentId)) {
      supervisor.coSupervisedStudents.push(studentId);
    }
    // Assign the supervisor to the student
    student.coSupervisors.push(supervisor.user_id);

    // Update the supervisor's coSupervisedStudents array with the student's ID

    // Save the updated student and supervisor data
    await student.save();
    await supervisor.save();
    const supervisorDetails = {
      name: supervisor.username,
      email: supervisor.email,
    };
    // Return success response
    return res
      .status(200)
      .json({ message: "Supervisor assigned successfully", supervisorDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getStudentCoSupervisors(req, res) {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
  const studentId = decoded.user_id;

  try {
    const student = await Student.getUserById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const coSupervisors = student.coSupervisors; // Array of co-supervisor IDs

    const coSupervisorsDetailsPromises = coSupervisors.map((lecturerId) =>
      Lecturer.getUserById(lecturerId)
    );

    const coSupervisorsDetails = await Promise.all(
      coSupervisorsDetailsPromises
    );

    const formattedDetails = coSupervisorsDetails.map((lecturer) => ({
      email: lecturer.email,
      name: lecturer.username,
    }));

    res.status(200).json(formattedDetails);
  } catch (error) {
    console.error(error);
  }
}

async function updateStudentProjectInfo(req, res) {
  const { projectInfo } = req.body;

  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decoded.user_id;
    // Find the student by ID
    const student = await Student.getUserById(userId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Update the project information using the new method
    await student.updateProjectInfo(projectInfo);

    return res
      .status(200)
      .json({ message: "The project information has been updated!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateStudentDetails(req, res) {
  const { username, email, matricCard, user_program, password } = req.body;

  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decoded.user_id;
    // Find the student by ID
    const student = await Student.getUserById(userId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Update the project information using the new method
    if (username !== undefined) {
      student.username = username;
    }
    if (email !== undefined) {
      student.email = email;
    }
    if (matricCard !== undefined) {
      student.matricCard = matricCard;
    }
    if (user_program !== undefined) {
      student.user_program = user_program;
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      student.password = hashedPassword;
    }
    await student.update();

    return res
      .status(200)
      .json({ message: "The student details has been updated!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getStudentsByProgram(req, res) {
  const { program } = req.params;
  try {
    const studentsData = await Student.getAllStudentsByProgram(program);
    if (!studentsData) {
      return res.status(404).json({ error: "Student not found" });
    }
    // Create a sanitized version of the users array without the password property
    const sanitizedStudents = studentsData.map(
      ({ user_id, username, email, matricCard, user_program }) => ({
        user_id,
        username,
        email,
        matricCard,
        user_program,
      })
    );

    res.status(200).json(sanitizedStudents); // Send the sanitized array of User instances in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getAllProjects,
  getUserById,
  getStudent,
  getUserByEmail,
  assignSupervisor,
  getSupervisorDetails,
  getExaminersDetails,
  updateStudentExaminers,
  updateStudentProjectInfo,
  updateStudentDetails,
  updateStudentCoSupervisors,
  getStudentCoSupervisors,
  getStudentsByProgram,
};
