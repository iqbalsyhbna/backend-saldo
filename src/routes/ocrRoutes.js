const express = require("express");
const router = express.Router();
const multer = require("multer");
const { readSaldoImage } = require("../controllers/ocrController");

const upload = multer({ dest: "uploads/" });

router.post("/read-saldo", upload.single("image"), readSaldoImage);

module.exports = router;