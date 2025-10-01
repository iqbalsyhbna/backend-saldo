const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create user
router.post("/", userController.create);

// Get all users
router.get("/", userController.getAll);

// Get user by ID
router.get("/:id", userController.getById);

// Update user
router.put("/:id", userController.update);

// Delete user
router.delete("/:id", userController.delete);

module.exports = router;
