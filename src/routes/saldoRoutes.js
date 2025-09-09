const express = require("express");
const router = express.Router();
const saldoController = require("../controllers/saldoController");

// Input saldo RKUD & SIPD
router.post("/", saldoController.create);

// Show semua saldo (dengan filter: tanggal, bulan, tahun)
router.get("/", saldoController.getAll);

// Show detail saldo by ID
router.get("/:id", saldoController.getById);

// Update saldo
router.put("/:id", saldoController.update);

// Hapus saldo
router.delete("/:id", saldoController.delete);

module.exports = router;
