const express = require("express");
const router = express.Router();

const lecturerController = require("../controllers/lecturerController");
const fileController = require("../controllers/fileUploadController");
const nominationController = require("../controllers/nominationController");

const authGuard = require("../middleware/roleAuth"); // Import the middleware
const verifyToken = require("../middleware/verifyToken");

// END POINTS FOR USER ROUTES
router.post("/lecturer/register", lecturerController.registerLecturer);
router.post("/lecturer/login", lecturerController.loginLecturer);
router.get("/lecturers", lecturerController.getAllLecturers);
router.get("/lecturer/myfiles", verifyToken, fileController.getSupervisorFiles);
router.get("/lecturer/userByEmail", lecturerController.getLecturerByEmail);
router.get("/lecturer/:userId", lecturerController.getLecturerById);
router.get("/lecturer/mystudents/:userId", lecturerController.getMyStudents);
router.post(
  "/lecturer/newnomination",
  verifyToken,
  nominationController.createNomination
);

module.exports = router;
