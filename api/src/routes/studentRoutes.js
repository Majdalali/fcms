const express = require("express");
const studentController = require("../controllers/usersControllers/studentController");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const fileUploadController = require("../controllers/generalControllers/fileUploadController");
const commentsController = require("../controllers/generalControllers/commentsController");

// // END POINTS FOR USER ROUTES
// router.post("/register", studentController.registerUser);
// router.post("/login", studentController.loginUser);

// router.get("/users", studentController.getAllUsers);

// router.get("/projects", studentController.getAllProjects);

// router.get("/userByEmail", studentController.getUserByEmail);
// router.get("/user/:userId", studentController.getUserById);
// router.get("/student/:userId", studentController.getStudent);

// router.get(
//   "/getSupervisorDetails/:studentId",
//   studentController.getSupervisorDetails
// );
// router.get(
//   "/getExaminersDetails/:userId",
//   studentController.getExaminersDetails
// );
// router.post(
//   "/checkExistingSubmission",
//   fileUploadController.checkExistingSubmission
// );

// router.get("/files/:fileName", fileUploadController.displayFile);
// router.get("/mycomments/:studentId", commentsController.getStudentComments);
// router.get("/myfiles", verifyToken, fileUploadController.getStudentFiles);
// router.delete(
//   "/deleteFile/:fileName",
//   verifyToken,
//   fileUploadController.deleteFileByFileName
// );
// router.post(
//   "/updateProjectInfo",
//   verifyToken,
//   studentController.updateStudentProjectInfo
// );
// router.post("/updateUser", verifyToken, studentController.updateStudentDetails);

// router.post(
//   "/udateCoSupervisors",
//   verifyToken,
//   studentController.updateStudentCoSupervisors
// );

// router.get(
//   "/myCoSupervisors",
//   verifyToken,
//   studentController.getStudentCoSupervisors
// );

// router.post(
//   "/removeSupervisor/:lecturerType",
//   verifyToken,
//   studentController.DeleteStudentLecturer
// );

// module.exports = function (io, connectedUsers) {
//   router.post(
//     "/uploadFile",
//     verifyToken,
//     fileUploadController.upload.array("file", 5), // Change the "5" to the maximum number of files allowed
//     fileUploadController.uploadFile.bind(null, io, connectedUsers)
//   );
//   router.post(
//     "/assignSupervisor",
//     verifyToken,
//     studentController.assignSupervisor.bind(null, io, connectedUsers)
//   );
//   return router;
// };

// User Management
router.post("/students", studentController.registerUser);
router.post("/students/login", studentController.loginUser);
router.get("/students", studentController.getAllUsers);

// Project Management
router.get("/projects", studentController.getAllProjects);

// Profile Management
router.get("/students/email/:email", studentController.getUserByEmail);

router.put(
  "/students/:userId/project",
  verifyToken,
  studentController.updateStudentProjectInfo
);

// Supervisor/Examiner Interactions
router.get("/student/:userId", studentController.getStudent);
router.get(
  "/students/:studentId/supervisors",
  studentController.getSupervisorDetails
);
router.get(
  "/students/:studentId/examiners",
  studentController.getExaminersDetails
);

// File Management

router.get("/myfiles", verifyToken, fileUploadController.getStudentFiles);
router.delete(
  "/students/files/:fileName",
  verifyToken,
  fileUploadController.deleteFileByFileName
);
router.get("/files/:fileName", fileUploadController.displayFile);

// Submission Status
router.post(
  "/checkExistingSubmission",
  fileUploadController.checkExistingSubmission
);

// Comments
router.get(
  "/students/:studentId/comments",
  commentsController.getStudentComments
);

// Co-Supervisor Management
router.get(
  "/students/co-supervisors",
  verifyToken,
  studentController.getStudentCoSupervisors
);

router.put(
  "/students/co-supervisors",
  verifyToken,
  studentController.updateStudentCoSupervisors
);

router.post(
  "/students/supervisors/:lecturerType",
  verifyToken,
  studentController.DeleteStudentLecturer
);

router.get("/students/:userId", studentController.getUserById);
router.put(
  "/students/:userId",
  verifyToken,
  studentController.updateStudentDetails
); // Update

module.exports = function (io, connectedUsers) {
  // File Management
  router.post(
    "/students/files/upload",
    verifyToken,
    fileUploadController.upload.array("file", 5),
    fileUploadController.uploadFile.bind(null, io, connectedUsers)
  );

  // Supervisor/Examiner Interactions
  router.post(
    "/students/assign-supervisor",
    verifyToken,
    studentController.assignSupervisor.bind(null, io, connectedUsers)
  );

  return router;
};
