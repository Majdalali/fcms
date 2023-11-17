const express = require("express");
const studentController = require("../controllers/studentController");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const fileUploadController = require("../controllers/fileUploadController");
const upload = require("../controllers/fileUploadController");

// END POINTS FOR USER ROUTES
router.post("/register", studentController.registerUser);
router.post("/login", studentController.loginUser);
router.get("/users", studentController.getAllUsers);
router.get("/userByEmail", studentController.getUserByEmail);
router.get("/user/:userId", studentController.getUserById);
router.post(
  "/assignSupervisor",
  verifyToken,
  studentController.assignSupervisor
);
router.get(
  "/getSupervisorDetails/:studentId",
  studentController.getSupervisorDetails
);
router.post(
  "/uploadFile",
  verifyToken,
  fileUploadController.upload.single("file"),
  fileUploadController.uploadFile
);
router.get("/getFile/:fileName", fileUploadController.displayFile);
module.exports = router;
