const { Op } = require("sequelize");
const Saldo = require("../models/saldo");
const moment = require("moment");

class SaldoService {
  // Create data baru
  async create(data) {
    return await Saldo.create(data);
  }

  // Ambil semua data dengan filter opsional
  async getAll(filters) {
    const where = {};

    if (filters.start && filters.end) {
      // pastikan format tanggal valid
      const startDate = moment(filters.start, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const endDate = moment(filters.end, "YYYY-MM-DD").format("YYYY-MM-DD");

      where.tanggal = {
        [Op.between]: [startDate, endDate],
      };
    }

    return await Saldo.findAll({
      where,
      order: [
        ["tanggal", "ASC"],
      ],
    });
  }

  // Ambil data by ID
  async getById(id) {
    return await Saldo.findByPk(id);
  }

  // Update data
  async update(id, data) {
    const saldo = await Saldo.findByPk(id);
    if (!saldo) throw new Error("Data tidak ditemukan");

    await saldo.update(data);
    return saldo;
  }

  // Hapus data
  async delete(id) {
    const saldo = await Saldo.findByPk(id);
    if (!saldo) throw new Error("Data tidak ditemukan");

    await saldo.destroy();
    return true;
  }
}

module.exports = new SaldoService();
