const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const authGuard = require("../middleware/roleAuth");
const adminGuard = require("../middleware/adminGuard");

const evaluationsController = require("../controllers/evaluationsController");
const criteriaController = require("../controllers/evaluationsControllers/criteriaController");

router.post(
  "/evaluate",
  verifyToken,
  authGuard("lecturer"),
  evaluationsController.createANomination
);

router.get("/evaluations", adminGuard, evaluationsController.getAllEvaluations);
router.get("/evaluations/:id", evaluationsController.getEvaluationsById);
router.get(
  "/myEvaluations",
  verifyToken,
  authGuard("lecturer"),
  evaluationsController.getLecturerEvaluations
);

router.get("/criteria/:program", criteriaController.getCriteriaByProgram);

module.exports = router;
