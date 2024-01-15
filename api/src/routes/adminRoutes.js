const express = require("express");
const router = express.Router();
const { verifyToken, clientToken } = require("../middleware/verifyToken");
const adminGuard = require("../middleware/adminGuard");

const sessionController = require("../controllers/generalControllers/sessionController");
const nominationsController = require("../controllers/generalControllers/nominationsController");
const notificationsController = require("../controllers/generalControllers/notificationsController");
const studentController = require("../controllers/usersControllers/studentController");
const lecturerController = require("../controllers/usersControllers/lecturerController");
const fileUploadController = require("../controllers/generalControllers/fileUploadController");
const criteriaController = require("../controllers/evaluationsControllers/criteriaController");
const ProgramController = require("../controllers/usersControllers/programController");

// Admin Routes
router.get(
  "/getProposals",
  adminGuard,
  fileUploadController.getProposalsForAdmin
);
router.post(
  "/updateProposal",
  adminGuard,
  fileUploadController.updateProposalStatusAndRemarks
);

router.post("/createSession", adminGuard, sessionController.createSession);

router.post("/api/admin", adminGuard, lecturerController.makeUserAdmin);

router.get(
  "/api/students/:program",
  adminGuard,
  studentController.getStudentsByProgram
);

router.get(
  "/api/nominations",
  adminGuard,
  nominationsController.getAllNominations
);

router.post(
  "/api/assignExaminers/:userId",
  adminGuard,
  studentController.updateStudentExaminers
);

router.post("/api/newCriteria", adminGuard, criteriaController.createCriteria);

router.get("/api/criterias", criteriaController.getAllCriteria);

router.delete(
  "/api/criterias/:program",
  adminGuard,
  criteriaController.deleteCriteriaByProgram
);

router.post("/api/newProgram", adminGuard, ProgramController.createProgram);

router.put(
  "/api/updateProgram/:programId",
  adminGuard,
  ProgramController.updateProgram
);

router.get("/api/programs", ProgramController.getPrograms);

module.exports = router;
