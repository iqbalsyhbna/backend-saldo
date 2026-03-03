const { extractSaldoData } = require("../services/ocrService");

const readSaldoImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image wajib diupload" });
    }

    const result = await extractSaldoData(req.file.path);

    res.json({
      message: "OCR berhasil",
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membaca gambar" });
  }
};

module.exports = { readSaldoImage };