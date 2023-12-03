const express = require("express");
const router = express.Router();

const lecturerController = require("../controllers/usersControllers/lecturerController");
const fileUploadController = require("../controllers/generalControllers/fileUploadController");
const nominationController = require("../controllers/generalControllers/nominationsController");
const commentsController = require("../controllers/generalControllers/commentsController");

const authGuard = require("../middleware/roleAuth"); // Import the middleware
const verifyToken = require("../middleware/verifyToken");

// END POINTS FOR USER ROUTES
router.post("/lecturer/register", lecturerController.registerLecturer);
router.post("/lecturer/login", lecturerController.loginLecturer);
router.get("/lecturers", lecturerController.getAllLecturers);
router.get(
  "/lecturer/myfiles",
  verifyToken,
  fileUploadController.getSupervisorFiles
);
router.get("/lecturer/userByEmail", lecturerController.getLecturerByEmail);
router.get("/lecturer/:userId", lecturerController.getLecturerById);
router.get("/lecturer/mystudents/:userId", lecturerController.getMyStudents);
router.post(
  "/lecturer/newnomination",
  verifyToken,
  nominationController.createNomination
);

router.post(
  "/lecturer/newcomment",
  verifyToken,
  commentsController.createComment
);

router.get(
  "/lecturer/mycomments/:lecturerId",
  commentsController.getLecturerComments
);

// router.get(
//   "/mycomments",
//   verifyToken,
//   commentsController.getMyLecturerComments
// );
module.exports = router;
