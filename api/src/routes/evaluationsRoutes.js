const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const authGuard = require("../middleware/roleAuth");

const evaluationsController = require("../controllers/evaluationsController");

router.post(
  "/evaluate",
  verifyToken,
  authGuard("lecturer"),
  evaluationsController.createANomination
);

router.get("/evaluations", evaluationsController.getAllEvaluations);
router.get("/evaluations/:id", evaluationsController.getEvaluationsById);
module.exports = router;
