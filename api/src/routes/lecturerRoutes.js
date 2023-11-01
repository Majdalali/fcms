const express = require("express");
const studentController = require("../controllers/lecturerController");
const router = express.Router();

// END POINTS FOR USER ROUTES
router.post("/lecturer/register", studentController.registerLecturer);
router.post("/lecturer/login", studentController.loginLecturer);
router.get("/lecturers", studentController.getAllLecturers);
router.get("/lecturer/userByEmail", studentController.getLecturerByEmail);
router.get("/lecturer/:userId", studentController.getLecturerById);

module.exports = router;
