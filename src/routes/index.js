const express = require("express");
const saldoRoutes = require("./saldoRoutes");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes")
const router = express.Router();

// Register semua routes
router.use("/auth", authRoutes);
router.use("/saldo", saldoRoutes);
router.use("/users", userRoutes);

module.exports = router;
