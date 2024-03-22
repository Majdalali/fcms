const express = require("express");
const router = express.Router();

const lecturerController = require("../controllers/usersControllers/lecturerController");
const fileUploadController = require("../controllers/generalControllers/fileUploadController");
const nominationController = require("../controllers/generalControllers/nominationsController");
const cvFileController = require("../controllers/generalControllers/cvFileController");
const commentsController = require("../controllers/generalControllers/commentsController");

const authGuard = require("../middleware/roleAuth");
const { verifyToken } = require("../middleware/verifyToken");

// END POINTS FOR USER ROUTES
router.post("/lecturer/register", lecturerController.registerLecturer);
router.post("/lecturer/login", lecturerController.loginLecturer);
router.get("/lecturers", lecturerController.getAllLecturers);
router.get(
  "/lecturer/myfiles",
  authGuard("lecturer"),
  fileUploadController.getAllLecturerStudentFiles
);
router.get(
  "/lecturer/myfiles/proposals",
  authGuard("lecturer"),
  fileUploadController.getAllLecturerProposalFiles
);
router.get("/lecturer/userByEmail", lecturerController.getLecturerByEmail);
router.post(
  "/updateLecturerDetails",
  authGuard("lecturer"),
  lecturerController.updateLecturerDetails
);
router.get("/lecturer/:userId", lecturerController.getLecturerById);
router.get("/lecturer/mystudents/:userId", lecturerController.getMyStudents);
router.get(
  "/lecturer/myCoSupervisedStudents/:userId",
  lecturerController.myCoSupervisedStudents
);
router.get("/lecturer/myExaminees/:userId", lecturerController.myExaminees);

router.post(
  "/lecturer/newnomination",
  verifyToken,
  cvFileController.cvUpload.array("cvFiles"),
  nominationController.createNomination
);

router.get(
  "/myNominations",
  verifyToken,
  nominationController.getNominationsForLecturer
);

router.delete(
  "/nominations/:nominationId",
  verifyToken,
  nominationController.deleteNominationById
);

router.get(
  "/lecturer/mycomments/:lecturerId",
  commentsController.getLecturerComments
);
router.delete(
  "/lecturer/deletecomment/:commentId",
  commentsController.deleteCommentById
);

module.exports = function (io, connectedUsers) {
  router.post(
    "/lecturer/newcomment",
    verifyToken, // Assuming verifyToken is defined elsewhere
    commentsController.createComment.bind(null, io, connectedUsers)
  );

  return router;
};

// router.get(
//   "/mycomments",
//   verifyToken,
//   commentsController.getMyLecturerComments
// );
