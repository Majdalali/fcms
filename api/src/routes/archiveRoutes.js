const express = require("express");
const router = express.Router();

const adminGuard = require("../middleware/adminGuard");

const archiveController = require("../controllers/generalControllers/archiveController");

router.post("/archiveTables", adminGuard, archiveController.archiveTables);

router.post(
  "/archiveProjects",
  adminGuard,
  archiveController.archiveProjectInfo
);

router.post(
  "/archiveNotifications",
  adminGuard,
  archiveController.archiveNotifications
);

router.post(
  "/restoreArchivedTables",
  adminGuard,
  archiveController.restoreArchivedTables
);

module.exports = router;
