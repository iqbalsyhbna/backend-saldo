const Tesseract = require("tesseract.js");

const extractSaldoData = async (imagePath) => {
  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, "eng", {
    logger: (m) => console.log(m),
  });

  const cleanNumber = (str) => {
    if (!str) return 0;

    let num = str.replace(/[^0-9]/g, "");

    if (num.length > 2) {
      const decimal = num.slice(-2);
      const integer = num.slice(0, -2);
      return parseFloat(integer + "." + decimal);
    }

    return parseFloat(num);
  };

  const totalPenerimaanMatch = text.match(
    /TOTAL PENERIMAAN\s*[:\-]?\s*([\d.,]+)/i,
  );
  const totalPengeluaranMatch = text.match(
    /TOTAL PENGELUARAN\s*[:\-]?\s*([\d.,]+)/i,
  );
  const saldoMatch = text.match(/SALDO\s*([\d.,]+)/i);

  return {
    raw_text: text,
    total_penerimaan: cleanNumber(totalPenerimaanMatch?.[1]),
    total_pengeluaran: cleanNumber(totalPengeluaranMatch?.[1]),
    saldo: cleanNumber(saldoMatch?.[1]),
  };
};

module.exports = { extractSaldoData };
