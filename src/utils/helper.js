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