const express = require("express");
const router = express.Router();
const multer = require("multer");
const { readSaldoImage } = require("../controllers/ocrController");

// ✅ Gunakan memory storage (tidak simpan file ke folder)
const upload = multer({
  storage: multer.memoryStorage(),

  // ✅ Batasi ukuran file (misal 5MB)
  limits: { fileSize: 5 * 1024 * 1024 },

  // ✅ Validasi hanya image
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("File harus berupa gambar"));
    } else {
      cb(null, true);
    }
  },
});

router.post("/read-saldo", upload.single("image"), readSaldoImage);

module.exports = router;