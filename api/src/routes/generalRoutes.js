const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/sessionController");
const nominationsController = require("../controllers/nominationController");

router.post("/createSession", sessionController.createSession);
router.get("/currentSession/:sessionTitle", sessionController.getSession);
router.get(
  "/nomination/:nominationId",
  nominationsController.getNominationById
);
module.exports = router;
