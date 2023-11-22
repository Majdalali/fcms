const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/generalControllers/sessionController");
const nominationsController = require("../controllers/generalControllers/nominationsController");

router.post("/createSession", sessionController.createSession);
router.get("/currentSession/:sessionTitle", sessionController.getSession);
router.get(
  "/nomination/:nominationId",
  nominationsController.getNominationById
);
module.exports = router;
