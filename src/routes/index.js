const express = require("express");
const saldoRoutes = require("./saldoRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

// Register semua routes
router.use("/saldo", saldoRoutes);
router.use("/users", userRoutes);

module.exports = router;
