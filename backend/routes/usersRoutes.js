// User Routes
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");

// Get all users
router.get("/", usersController.getAllUsers);

// Login a user
router.post("/login", usersController.loginUser);

// Register a new user
router.post("/register", usersController.registerUser);

module.exports = router;
