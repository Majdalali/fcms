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

module.exports = router;
