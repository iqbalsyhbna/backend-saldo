const saldoService = require("../services/saldoService");
const {
  enrichSaldo,
  formatRupiah,
  drawRow,
} = require("../utils/helper");
const { successResponse, errorResponse } = require("../utils/response");
const PDFDocument = require("pdfkit-table");
const moment = require("moment");

class SaldoController {
  // Tambah data baru
  async create(req, res) {
    try {
      const data = await saldoService.create(req.body);
      return successResponse(res, data, "Saldo berhasil ditambahkan");
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  // Ambil semua data (bisa filter)
  async getAll(req, res) {
    try {
      const filters = req.query; // ?tanggal=...&bulan=...&tahun=...
      const data = await saldoService.getAll(filters);

      const enriched = data.map(enrichSaldo);
      return successResponse(res, enriched);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  // Ambil data by ID
  async getById(req, res) {
    try {
      const data = await saldoService.getById(req.params.id);
      if (!data) return errorResponse(res, "Data tidak ditemukan", 404);
      const enriched = enrichSaldo(data);
      return successResponse(res, enriched);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  // Update data
  async update(req, res) {
    try {
      const data = await saldoService.update(req.params.id, req.body);
      return successResponse(res, data, "Data berhasil diperbarui");
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  // Hapus data
  async delete(req, res) {
    try {
      await saldoService.delete(req.params.id);
      return successResponse(res, null, "Data berhasil dihapus");
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  async exportRekonPdf(req, res) {
    try {
      const { start, end } = req.query;

      // Ambil data real dari DB sesuai date range
      const data = await saldoService.getAll({ start, end });

      const filtered = data.map((row) => ({
        tanggal: row.tanggal,
        penerimaan_rkud: Number(row.penerimaan_rkud),
        pengeluaran_rkud: Number(row.pengeluaran_rkud),
        penerimaan_sipd: Number(row.penerimaan_sipd),
        pengeluaran_sipd: Number(row.pengeluaran_sipd),
      }));

      const doc = new PDFDocument({ margin: 30, size: "A4" });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=rekonsiliasi.pdf"
      );
      doc.pipe(res);

      // Cari periode
      let startDate = start;
      let endDate = end;

      if ((!startDate || !endDate) && filtered.length > 0) {
        const sorted = [...filtered].sort(
          (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
        );
        startDate = sorted[0].tanggal; // tanggal paling awal
        endDate = sorted[sorted.length - 1].tanggal; // tanggal paling akhir
      }

      // Judul
      doc
        .fontSize(16)
        .text("Laporan Rekonsiliasi Keuangan RKUD – SIPD", { align: "center" });
      doc.moveDown();
      if (startDate && endDate) {
        doc
          .fontSize(12)
          .text(
            `Periode: ${moment(startDate).format("DD MMMM YYYY")} s/d ${moment(
              endDate
            ).format("DD MMMM YYYY")}`
          );
      } else {
        doc.fontSize(12).text("Periode: -");
      }
      doc.moveDown(2);

      // Tabel
      const table = {
        headers: [
          { label: "Tanggal", property: "tanggal", width: 50, align: "left" },
          {
            label: "Penerimaan RKUD",
            property: "rkud_in",
            width: 100,
            align: "left",
          },
          {
            label: "Penerimaan SIPD",
            property: "sipd_in",
            width: 100,
            align: "left",
          },
          {
            label: "Status",
            property: "in_status",
            width: 50,
            align: "left",
          },
          {
            label: "Pengeluaran RKUD",
            property: "rkud_out",
            width: 100,
            align: "left",
          },
          {
            label: "Pengeluaran SIPD",
            property: "sipd_out",
            width: 100,
            align: "left",
          },
          {
            label: "Status",
            property: "out_status",
            width: 40,
            align: "left",
          },
        ],
        datas: filtered.map((row) => ({
          tanggal: moment(row.tanggal).format("DD MMM YYYY"),
          rkud_in: formatRupiah(row.penerimaan_rkud),
          sipd_in: formatRupiah(row.penerimaan_sipd),
          in_status:
            row.penerimaan_rkud === row.penerimaan_sipd ? "Match" : "Not Match",
          rkud_out: formatRupiah(row.pengeluaran_rkud),
          sipd_out: formatRupiah(row.pengeluaran_sipd),
          out_status:
            row.pengeluaran_rkud === row.pengeluaran_sipd
              ? "Match"
              : "Not Match",
        })),
      };

      await doc.table(table);

      // Cek apakah ada cukup ruang untuk ringkasan + keterangan
      const neededSpace = 200; // tinggi kira-kira untuk ringkasan + kotak keterangan
      if (doc.y + neededSpace > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
      }

      // Ringkasan
      const totalRKUDIn = filtered.reduce(
        (acc, r) => acc + r.penerimaan_rkud,
        0
      );
      const totalSIPDIn = filtered.reduce(
        (acc, r) => acc + r.penerimaan_sipd,
        0
      );
      const totalRKUDOut = filtered.reduce(
        (acc, r) => acc + r.pengeluaran_rkud,
        0
      );
      const totalSIPDOut = filtered.reduce(
        (acc, r) => acc + r.pengeluaran_sipd,
        0
      );

      // Panggil row dengan alternating colors
      let rowIndex = 0;
      drawRow(
        doc,
        "Total Penerimaan RKUD:",
        formatRupiah(totalRKUDIn),
        rowIndex++ % 2
      );
      drawRow(
        doc,
        "Total Penerimaan SIPD:",
        formatRupiah(totalSIPDIn),
        rowIndex++ % 2
      );
      drawRow(
        doc,
        "Selisih Penerimaan:",
        formatRupiah(totalRKUDIn - totalSIPDIn),
        rowIndex++ % 2
      );
      drawRow(
        doc,
        "Total Pengeluaran RKUD:",
        formatRupiah(totalRKUDOut),
        rowIndex++ % 2
      );
      drawRow(
        doc,
        "Total Pengeluaran SIPD:",
        formatRupiah(totalSIPDOut),
        rowIndex++ % 2
      );
      drawRow(
        doc,
        "Selisih Pengeluaran:",
        formatRupiah(totalRKUDOut - totalSIPDOut),
        rowIndex++ % 2
      );

      doc.moveDown(2);

      // Sama juga sebelum kotak keterangan
      if (doc.y + 100 > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
      }

      // Tentukan isi keterangan (custom bisa dinamis juga)
      const keteranganList = [];

      if (totalRKUDIn !== totalSIPDIn) {
        keteranganList.push("Penerimaan tidak sesuai");
      }

      if (totalRKUDOut !== totalSIPDOut) {
        keteranganList.push("Pengeluaran tidak sesuai");
      }

      // Kalau tidak ada masalah
      if (keteranganList.length === 0) {
        keteranganList.push("Sesuai");
      }

      // Kotak keterangan
      const pageWidth = doc.page.width;
      const margin = doc.page.margins.left;
      const startX = margin;
      const startY = doc.y;
      const boxWidth = pageWidth - margin * 2;
      const lineHeight = 16;

      // Hitung tinggi kotak (judul + isi)
      const boxHeight = (keteranganList.length + 1) * lineHeight + 10;

      // Gambar kotak
      doc.rect(startX, startY, boxWidth, boxHeight).stroke();

      // Tulis judul "Keterangan"
      doc
        .fontSize(12)
        .fillColor("black")
        .text("Keterangan", startX + 10, startY + 8);

      // Tulis daftar keterangan
      keteranganList.forEach((item, i) => {
        doc.text(`- ${item}`, startX + 10, startY + 8 + lineHeight * (i + 1));
      });

      doc.end();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new SaldoController();
