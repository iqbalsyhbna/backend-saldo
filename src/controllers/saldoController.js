const saldoService = require("../services/saldoService");
const { enrichSaldo } = require("../utils/helper");
const { successResponse, errorResponse } = require("../utils/response");

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
}

module.exports = new SaldoController();
