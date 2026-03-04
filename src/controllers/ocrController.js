const { extractSaldoData } = require("../services/ocrService");

const readSaldoImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image wajib diupload",
      });
    }

    // ✅ Sekarang pakai buffer, bukan path
    const imageBuffer = req.file.buffer;

    const result = await extractSaldoData(imageBuffer);

    res.json({
      message: "OCR berhasil",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Gagal membaca gambar",
    });
  }
};

module.exports = { readSaldoImage };