const express = require("express");
const router = express.Router();
const { verifyToken, clientToken } = require("../middleware/verifyToken");
const adminGuard = require("../middleware/adminGuard");
const coordinatorGuard = require("../middleware/coordinatorGuard");

const sessionController = require("../controllers/generalControllers/sessionController");
const nominationsController = require("../controllers/generalControllers/nominationsController");
const notificationsController = require("../controllers/generalControllers/notificationsController");
const studentController = require("../controllers/usersControllers/studentController");
const lecturerController = require("../controllers/usersControllers/lecturerController");
const fileUploadController = require("../controllers/generalControllers/fileUploadController");
const criteriaController = require("../controllers/evaluationsControllers/criteriaController");
const ProgramController = require("../controllers/usersControllers/programController");

//! Super Admin Routes

router.post("/createSession", adminGuard, sessionController.createSession);

router.put(
  "/updateSession/:sessionId",
  adminGuard,
  sessionController.updateSessionBypass
);

router.delete(
  "/deleteSession/:sessionId",
  adminGuard,
  sessionController.deleteSession
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

//TODO IS CRITERIA CREATED BY COORDINATOR OR SUPER ADMIN?
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

//? Coordinator Routes

router.get(
  "/getProposals",
  coordinatorGuard,
  fileUploadController.getProposalsForAdmin
);

router.post(
  "/updateProposal",
  coordinatorGuard,
  fileUploadController.updateProposalStatusAndRemarks
);

router.get(
  "/api/students/:program",
  coordinatorGuard,
  studentController.getStudentsByProgram
);

router.get(
  "/api/nominations",
  coordinatorGuard,
  nominationsController.getAllNominations
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

module.exports = router;
