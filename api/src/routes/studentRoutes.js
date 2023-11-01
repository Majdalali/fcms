const express = require("express");
const studentController = require("../controllers/studentController");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

// END POINTS FOR USER ROUTES
router.post("/register", studentController.registerUser);
router.post("/login", studentController.loginUser);
router.get("/users", verifyToken, studentController.getAllUsers);
router.get("/userByEmail", studentController.getUserByEmail);
router.get("/user/:userId", studentController.getUserById);
router.post(
  "/assignSupervisor",
  verifyToken,
  studentController.assignSupervisor
);
router.get(
  "/getSupervisorDetails/:studentId",
  studentController.getSupervisorDetails
);
module.exports = router;
