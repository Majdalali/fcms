const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const adminGuard = require("../middleware/adminGuard");

const sessionController = require("../controllers/generalControllers/sessionController");
const nominationsController = require("../controllers/generalControllers/nominationsController");
const notificationsController = require("../controllers/generalControllers/notificationsController");
const studentController = require("../controllers/usersControllers/studentController");
const lecturerController = require("../controllers/usersControllers/lecturerController");
// Session Routes

router.post(
  "/createSession",

  sessionController.createSession
);
router.get("/currentSession/:sessionTitle", sessionController.getSession);
router.get("/currentSession", sessionController.getLatestSession);
router.delete("/session/:sessionId", sessionController.deleteSession);

// Nominations Routes

router.get(
  "/nomination/:nominationId",
  nominationsController.getNominationById
);

// Notifications Routes

router.post(
  "/postNotification",
  verifyToken,
  notificationsController.createNotification
);
router.get("/notifications", notificationsController.getAllNotifications);
router.delete(
  "/notification/:notificationId",
  notificationsController.deleteNotification
);
// router.get(
//   "/notifications/:userId",
//   notificationsController.getNotificationByUserId
// );
router.get(
  "/myNotifications",
  verifyToken,
  notificationsController.getMyNotifications
);

// Examiners Routes
router.post(
  "/updateStudentExaminer/:userId",
  studentController.updateStudentExaminers
);

router.post(
  "/updateLecturerExaminee/:userId",
  lecturerController.updateLecturerExaminees
);

module.exports = router;
