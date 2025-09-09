const { Op } = require("sequelize");
const Saldo = require("../models/saldo");

class SaldoService {
  // Create data baru
  async create(data) {
    return await Saldo.create(data);
  }

  // Ambil semua data dengan filter opsional
  async getAll(filters) {
    const where = {};

    if (filters.tanggal) {
      where.tanggal = filters.tanggal;
    }

    if (filters.bulan && filters.tahun) {
      where.tanggal = {
        [Op.between]: [
          `${filters.tahun}-${filters.bulan}-01`,
          `${filters.tahun}-${filters.bulan}-31`
        ],
      };
    }

    if (filters.tahun && !filters.bulan) {
      where.tanggal = {
        [Op.between]: [`${filters.tahun}-01-01`, `${filters.tahun}-12-31`],
      };
    }

    return await Saldo.findAll({
      where,
      order: [["tanggal", "ASC"], ["waktu", "ASC"]],
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
