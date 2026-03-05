const Tesseract = require("tesseract.js");

const extractSaldoData = async (buffer) => {
  const {
    data: { text },
  } = await Tesseract.recognize(buffer, "eng", {
    tessedit_pageseg_mode: 6,
  });

  // 🔥 Clean angka Indonesia
  const cleanNumber = (str) => {
    if (!str) return 0;

    return parseFloat(
      str
        .replace(/[^\d.,]/g, "")
        .replace(/\./g, "") // hapus ribuan
        .replace(",", ".") // ubah decimal
    ) || 0;
  };

  // 🔥 Ambil angka pertama setelah keyword di baris yang sama
  const extractFromLine = (keyword) => {
    const regex = new RegExp(
      `${keyword}[^\\n\\r]*?([\\d.]+,[\\d]+)`,
      "i"
    );

    const match = text.match(regex);
    return cleanNumber(match?.[1]);
  };

  const total_penerimaan = extractFromLine("TOTAL\\s*PENERIMAAN");
  const total_pengeluaran = extractFromLine("TOTAL\\s*PENGELUARAN");
  const saldo = extractFromLine("SALDO");

  return {
    raw_text: text,
    total_penerimaan,
    total_pengeluaran,
    saldo,
  };
};

module.exports = { extractSaldoData };