const bcrypt = require("bcryptjs");
const Lecturer = require("../models/LecturerModel");
const userHandler = require("../Handlers/lecturerHandler");

async function registerLecturer(req, res) {
  const { username, email, password, user_type } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const existingUserByEmail = await Lecturer.getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Create a new user instance with hashed password
    const newUser = new Lecturer({
      username,
      email,
      password: hashedPassword,
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
async function loginLecturer(req, res) {
  const { email, matricCard, password } = req.body;

  try {
    // Find the user by matric card or email
    const user = await Lecturer.getUserByEmailOrMatric(email, matricCard);
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

    // User is authenticated, send a success response
    // You might also generate and send a JWT token for authentication at this point

    // Remove password from the response
    const responseUser = { ...user };
    delete responseUser.password;

    return res
      .status(200)
      .json({ message: "Login successful", user: responseUser });
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
      ({ user_id, username, email, matricCard, user_type }) => ({
        user_id,
        username,
        email,
        matricCard,
        user_type,
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

module.exports = {
  registerLecturer,
  loginLecturer,
  getAllLecturers,
  getLecturerById,
  getLecturerByEmail,
};