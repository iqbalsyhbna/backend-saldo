const saldoService = require("../services/saldoService");
const { enrichSaldo, parseNumber, formatRupiah } = require("../utils/helper");
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
        penerimaan_rkud: parseNumber(row.penerimaan_rkud),
        pengeluaran_rkud: parseNumber(row.pengeluaran_rkud),
        penerimaan_sipd: parseNumber(row.penerimaan_sipd),
        pengeluaran_sipd: parseNumber(row.pengeluaran_sipd),
      }));

      const doc = new PDFDocument({ margin: 30, size: "A4" });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=rekonsiliasi.pdf"
      );
      doc.pipe(res);

      // Judul
      doc
        .fontSize(16)
        .text("Laporan Rekonsiliasi RKUD vs SIPD", { align: "center" });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(
          `Periode: ${moment(start).format("DD MMMM YYYY")} s/d ${moment(
            end
          ).format("DD MMMM YYYY")}`
        );
      doc.moveDown(2);

      // Tabel
      const table = {
        headers: [
          { label: "Tanggal", property: "tanggal", width: 70, align: "center" },
          {
            label: "Penerimaan RKUD",
            property: "rkud_in",
            width: 90,
            align: "right",
          },
          {
            label: "Penerimaan SIPD",
            property: "sipd_in",
            width: 90,
            align: "right",
          },
          {
            label: "Status",
            property: "in_status",
            width: 60,
            align: "center",
          },
          {
            label: "Pengeluaran RKUD",
            property: "rkud_out",
            width: 90,
            align: "right",
          },
          {
            label: "Pengeluaran SIPD",
            property: "sipd_out",
            width: 90,
            align: "right",
          },
          {
            label: "Status",
            property: "out_status",
            width: 60,
            align: "center",
          },
        ],
        datas: filtered.map((row) => ({
          tanggal: moment(row.tanggal).format("YYYY-MM-DD"),
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

      // Ringkasan (rapi 2 kolom)
      doc.moveDown(2);
      doc.fontSize(12).text("Ringkasan:", { underline: true });

      // Penerimaan RKUD
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Total Penerimaan RKUD:");
      doc.font("Helvetica").text(formatRupiah(totalRKUDIn), { align: "right" });

      // Penerimaan SIPD
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Total Penerimaan SIPD:");
      doc.font("Helvetica").text(formatRupiah(totalSIPDIn), { align: "right" });

      // Selisih Penerimaan
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Selisih Penerimaan:");
      doc
        .font("Helvetica")
        .text(formatRupiah(totalRKUDIn - totalSIPDIn), { align: "right" });

      // Pengeluaran RKUD
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Total Pengeluaran RKUD:");
      doc
        .font("Helvetica")
        .text(formatRupiah(totalRKUDOut), { align: "right" });

      // Pengeluaran SIPD
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Total Pengeluaran SIPD:");
      doc
        .font("Helvetica")
        .text(formatRupiah(totalSIPDOut), { align: "right" });

      // Selisih Pengeluaran
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").text("Selisih Pengeluaran:");
      doc
        .font("Helvetica")
        .text(formatRupiah(totalRKUDOut - totalSIPDOut), { align: "right" });

      doc.end();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new SaldoController();
