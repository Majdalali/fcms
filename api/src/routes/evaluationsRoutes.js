const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const authGuard = require("../middleware/roleAuth");
const adminGuard = require("../middleware/adminGuard");
const coordinatorGuard = require("../middleware/coordinatorGuard");
const adminOrCoordGuard = require("../middleware/adminOrCoordGuard");

const evaluationsController = require("../controllers/evaluationsController");
const criteriaController = require("../controllers/evaluationsControllers/criteriaController");
const chairmanController = require("../controllers/evaluationsControllers/chairmanController");

router.post(
  "/evaluate",
  verifyToken,
  authGuard("lecturer"),
  evaluationsController.createAnEvaluation
);

router.get(
  "/evaluations",
  adminOrCoordGuard,
  evaluationsController.getAllEvaluations
);

router.get(
  "/evaluations/questionnaires",
  adminOrCoordGuard,
  evaluationsController.getQuestionnaireEvaluations
);

router.get(
  "/students/evaluations/:programType",
  verifyToken,
  evaluationsController.getStudentEvals
);

router.get(
  "/evaluations/:criteriaProgram",
  coordinatorGuard,
  evaluationsController.getEvaluationsByProgram
);

router.get("/evaluations/:id", evaluationsController.getEvaluationsById);

router.get(
  "/myEvaluations",
  verifyToken,
  authGuard("lecturer"),
  evaluationsController.getLecturerEvaluations
);

router.get("/criteria/:program", criteriaController.getCriteriaByProgram);

router.delete(
  "/evaluations/:id",
  verifyToken,
  authGuard("lecturer"),
  evaluationsController.deleteEvaluationById
);

//? Chairman Routes
router.post(
  "/api/chairmanApp",
  verifyToken,
  adminOrCoordGuard,
  chairmanController.createChairmanApp
);

router.get(
  "/api/chairmanApps",
  verifyToken,
  adminOrCoordGuard,
  chairmanController.getAllChairmanApps
);

router.put(
  "/api/chairmanApp",
  verifyToken,
  adminOrCoordGuard,
  chairmanController.updateChairmanApp
);

router.get(
  "/api/student/chairmanApp",
  verifyToken,
  chairmanController.getStudentApp
);

router.put(
  "/api/chairmanApp/document",
  verifyToken,
  adminOrCoordGuard,
  chairmanController.deleteSupportingDoc
);

module.exports = router;
