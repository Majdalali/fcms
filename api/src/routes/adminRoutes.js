const express = require("express");
const router = express.Router();
const adminGuard = require("../middleware/adminGuard");
const coordinatorGuard = require("../middleware/coordinatorGuard");
const authGuard = require("../middleware/roleAuth");
const adminOrCoordGuard = require("../middleware/adminOrCoordGuard");

const sessionController = require("../controllers/generalControllers/sessionController");
const nominationsController = require("../controllers/generalControllers/nominationsController");
const studentController = require("../controllers/usersControllers/studentController");
const lecturerController = require("../controllers/usersControllers/lecturerController");
const fileUploadController = require("../controllers/generalControllers/fileUploadController");
const criteriaController = require("../controllers/evaluationsControllers/criteriaController");
const ProgramController = require("../controllers/usersControllers/programController");
const generalFileUploadController = require("../controllers/generalControllers/generalFileUploadController");
const passwordController = require("../controllers/generalControllers/passwordController");

//? Shared Routes
router.post(
  "/upload",
  adminOrCoordGuard,
  generalFileUploadController.gUpload.array("files"),
  generalFileUploadController.generalizedUploadFile
);

router.delete(
  "/api/deleteFile/:fileId",
  adminOrCoordGuard,
  generalFileUploadController.deleteGFile
);
router.post(
  "/createSession",
  adminOrCoordGuard,
  sessionController.createSession
);

router.put(
  "/updateSession/:sessionId",
  adminOrCoordGuard,
  sessionController.updateSessionBypass
);

router.delete(
  "/deleteSession/:sessionId",
  adminOrCoordGuard,
  sessionController.deleteSession
);

router.get(
  "/api/students/:program",
  adminOrCoordGuard,
  studentController.getStudentsByProgram
);

router.get(
  "/api/nominations",
  adminOrCoordGuard,
  nominationsController.getAllNominations
);

//! Super Admin Routes

router.delete(
  "/api/lecturers/:userId",
  adminGuard,
  lecturerController.deleteLecturer
);

router.post("/api/admin", adminGuard, lecturerController.makeUserAdmin);

router.post(
  "/api/privilege",
  adminGuard,
  lecturerController.changeUserPrivileges
);

router.post("/api/newProgram", adminGuard, ProgramController.createProgram);

router.put(
  "/api/updateProgram/:programId",
  adminGuard,
  ProgramController.updateProgram
);

router.get("/api/programs", ProgramController.getPrograms);

router.post(
  "/removeExaminer",
  adminGuard,
  studentController.DeleteStudentExaminer
);

//? Coordinator Routes

router.get("/api/criterias", criteriaController.getAllCriteria);

router.delete(
  "/api/criterias/:program",
  coordinatorGuard,
  criteriaController.deleteCriteriaByProgram
);
router.post(
  "/api/newCriteria",
  coordinatorGuard,
  criteriaController.createCriteria
);

router.get(
  "/getProposals",
  coordinatorGuard,
  fileUploadController.getProposalsForAdmin
);

router.get(
  "/api/coordSubmissions",
  coordinatorGuard,
  fileUploadController.getAllFilesForCoordinator
);

router.post(
  "/updateProposal",
  coordinatorGuard,
  fileUploadController.updateProposalStatusAndRemarks
);

router.get(
  "/api/nominations/:program",
  coordinatorGuard,
  nominationsController.getNominationsByProgram
);

router.post(
  "/api/assignExaminers/:userId",
  coordinatorGuard,
  studentController.updateStudentExaminers
);

module.exports = function (io, connectedUsers) {
  router.put(
    "/api/resetPassword",
    adminGuard,
    passwordController.changePassword.bind(null, io, connectedUsers)
  );

  return router;
};
