const express = require("express");
const studentController = require("../controllers/usersControllers/studentController");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const fileUploadController = require("../controllers/generalControllers/fileUploadController");
const commentsController = require("../controllers/generalControllers/commentsController");

// END POINTS FOR USER ROUTES
router.post("/register", studentController.registerUser);
router.post("/login", studentController.loginUser);

router.get("/users", studentController.getAllUsers);

router.get("/projects", studentController.getAllProjects);

router.get("/userByEmail", studentController.getUserByEmail);
router.get("/user/:userId", studentController.getUserById);
router.get("/student/:userId", studentController.getStudent);

router.get(
  "/getSupervisorDetails/:studentId",
  studentController.getSupervisorDetails
);
router.get(
  "/getExaminersDetails/:userId",
  studentController.getExaminersDetails
);
router.post(
  "/checkExistingSubmission",
  fileUploadController.checkExistingSubmission
);

router.get("/files/:fileName", fileUploadController.displayFile);
router.get("/mycomments/:studentId", commentsController.getStudentComments);
router.get("/myfiles", verifyToken, fileUploadController.getStudentFiles);
router.delete(
  "/deleteFile/:fileName",
  verifyToken,
  fileUploadController.deleteFileByFileName
);
router.post(
  "/updateProjectInfo",
  verifyToken,
  studentController.updateStudentProjectInfo
);
router.post("/updateUser", verifyToken, studentController.updateStudentDetails);

router.post(
  "/udateCoSupervisors",
  verifyToken,
  studentController.updateStudentCoSupervisors
);

router.get(
  "/myCoSupervisors",
  verifyToken,
  studentController.getStudentCoSupervisors
);

module.exports = function (io, connectedUsers) {
  router.post(
    "/uploadFile",
    verifyToken,
    fileUploadController.upload.array("file", 5), // Change the "5" to the maximum number of files allowed
    fileUploadController.uploadFile.bind(null, io, connectedUsers)
  );
  router.post(
    "/assignSupervisor",
    verifyToken,
    studentController.assignSupervisor.bind(null, io, connectedUsers)
  );
  return router;
};
