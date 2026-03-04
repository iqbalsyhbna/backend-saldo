const Tesseract = require("tesseract.js");

const extractSaldoData = async (buffer) => {
  const {
    data: { text },
  } = await Tesseract.recognize(buffer, "eng", {
    logger: (m) => console.log(m),

    // 🔥 Batasi karakter agar OCR lebih akurat
    tessedit_char_whitelist:
      "0123456789.,TOTALPENGELUARANSALDOabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  });

  const cleanNumber = (str) => {
    if (!str) return 0;

    str = str.trim();
    str = str.replace(/[^\d.,]/g, "");
    str = str.replace(/\s+/g, "");

    // hapus titik ribuan
    str = str.replace(/\./g, "");

    // ubah koma jadi decimal
    str = str.replace(",", ".");

    return parseFloat(str) || 0;
  };

  const totalPenerimaanMatch = text.match(
    /TOTAL\s*PENERIMAAN[\s\S]{0,50}?([\d.,\s]+)/i
  );

  const totalPengeluaranMatch = text.match(
    /TOTAL\s*PENGELUARAN[\s\S]{0,50}?([\d.,\s]+)/i
  );

  const saldoMatch = text.match(
    /SALDO[\s\S]{0,50}?([\d.,\s]+)/i
  );

  return {
    raw_text: text,
    total_penerimaan: cleanNumber(totalPenerimaanMatch?.[1]),
    total_pengeluaran: cleanNumber(totalPengeluaranMatch?.[1]),
    saldo: cleanNumber(saldoMatch?.[1]),
  };
};

module.exports = { extractSaldoData };