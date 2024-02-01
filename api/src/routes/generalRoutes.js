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
// Session Routes

router.get("/currentSession/:sessionTitle", sessionController.getSession);
router.get("/currentSession", sessionController.getLatestSession);
router.delete("/session/:sessionId", sessionController.deleteSession);

// Nominations Routes

router.get(
  "/nomination/:nominationId",
  adminGuard,
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

// Client Token Validation Route
router.post("/validateToken", clientToken);

router.post("/deadline", sessionController.checkDeadline);
// router.get("/session/:program", sessionController.getSessionByProgram);
module.exports = router;
