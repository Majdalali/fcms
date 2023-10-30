const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/users", userController.getAllUsers);
router.get("/userByEmail", userController.getUserByEmail);
router.get("/user/:userId", userController.getUserById);

module.exports = router;
