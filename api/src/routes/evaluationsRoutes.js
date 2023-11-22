const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const authGuard = require("../middleware/roleAuth");

const evaluationsController = require("../controllers/evaluationsController");

router.post(
  "/mecc/supervisor",
  verifyToken,
  authGuard("lecturer"),
  evaluationsController.createSVEvaluationMECC
);

router.post(
  "/mecc/examiner",
  verifyToken,
  authGuard("lecturer"),
  evaluationsController.createEXEvaluationMECC
);

router.get("/mecc/:id", evaluationsController.getEvaluationsById);
module.exports = router;
