const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const authGuard = require("../middleware/roleAuth");
const adminGuard = require("../middleware/adminGuard");
const coordinatorGuard = require("../middleware/coordinatorGuard");
const adminOrCoordGuard = require("../middleware/adminOrCoordGuard");

const evaluationsController = require("../controllers/evaluationsController");
const criteriaController = require("../controllers/evaluationsControllers/criteriaController");

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

module.exports = router;
