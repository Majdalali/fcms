const bcrypt = require("bcryptjs");
const Student = require("../../models/usersModels/studentModel");
const Lecturer = require("../../models/usersModels/lecturerModel");
const userHandler = require("../../Handlers/studentHandler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_TOKEN;

async function registerUser(req, res) {
  const { username, email, password, user_type, matricCard } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const existingUserByEmail = await Student.getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Create a new user instance with hashed password
    const newUser = new Student({
      username,
      email,
      password: hashedPassword,
      matricCard: matricCard || null,
      user_type,
    });
    await newUser.save();

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
async function loginUser(req, res) {
  const { email, matricCard, password } = req.body;

  try {
    // Find the user by matric card or email
    const user = await Student.getUserByEmailOrMatric(email, matricCard);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid matric card or email or password" });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid matric card or email or password" });
    }

    // User is authenticated, generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, user_type: user.user_type },
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
      }) => ({
        user_id,
        username,
        email,
        matricCard,
        user_type,
        supervisor,
        examiners,
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
  const studentId = req.user.user_id;

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

    // Return success response
    return res
      .status(200)
      .json({ message: "Supervisor assigned successfully" });
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

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  assignSupervisor,
  getSupervisorDetails,
};
