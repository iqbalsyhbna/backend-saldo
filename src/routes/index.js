const express = require("express");
const saldoRoutes = require("./saldoRoutes");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes")
const ocrRoutes = require("./ocrRoutes");
const router = express.Router();

// Register semua routes
router.use("/auth", authRoutes);
router.use("/saldo", saldoRoutes);
router.use("/ocr", ocrRoutes);
router.use("/users", userRoutes);

module.exports = router;
