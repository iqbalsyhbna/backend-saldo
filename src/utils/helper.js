export function enrichSaldo(item) {
  const rkudIn = parseFloat(item.penerimaan_rkud || 0);
  const sipdIn = parseFloat(item.penerimaan_sipd || 0);
  const rkudOut = parseFloat(item.pengeluaran_rkud || 0);
  const sipdOut = parseFloat(item.pengeluaran_sipd || 0);

  return {
    ...item.toJSON(),
    selisih_penerimaan: rkudIn - sipdIn,
    selisih_pengeluaran: rkudOut - sipdOut,
    keterangan:
      rkudIn === sipdIn && rkudOut === sipdOut
        ? "Sesuai"
        : rkudIn !== sipdIn && rkudOut === sipdOut
        ? "Penerimaan tidak sesuai"
        : rkudIn === sipdIn && rkudOut !== sipdOut
        ? "Pengeluaran tidak sesuai"
        : "Penerimaan & Pengeluaran tidak sesuai",
  };
}

export function parseNumber(value) {
  if (!value) return 0;
  return parseFloat(
    value.toString()
      .replace(/\./g, "")   // hapus pemisah ribuan
      .replace(",", ".")    // ubah koma jadi titik (decimal)
  ) || 0;
}

export function formatRupiah(num) {
  return "Rp. " + num.toLocaleString("id-ID", { minimumFractionDigits: 2 });
}

export function drawRow(doc, label, value, isOdd) {
  const rowHeight = 20;
  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const startX = doc.page.margins.left;
  const currentY = doc.y;

  // Warna latar (genap = abu terang, ganjil = putih)
  if (isOdd) {
    doc.rect(startX, currentY, pageWidth, rowHeight).fill("#f0f0f0");
  } else {
    doc.rect(startX, currentY, pageWidth, rowHeight).fill("#ffffff");
  }

  // Reset fill ke hitam untuk teks
  doc.fillColor("black");

  // Label kiri
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(label, startX + 5, currentY + 5, {
      continued: true,
    });

  // Value kanan
  doc.font("Helvetica").text(value, {
    align: "right",
    width: pageWidth - 10,
  });

  // Geser Y manual biar tidak menimpa
  doc.y = currentY + rowHeight;
}