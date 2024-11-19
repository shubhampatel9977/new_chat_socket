const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Define routes
router.post('/register', authController.signUpController);
router.post('/logIn', authController.logInController);
router.get('/allUsers', authController.getAllUsersController);

module.exports = router;