const User = require("../models/users");
const bcrypt = require("bcrypt");

class UserService {
  // Create user baru dengan hash password
  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await User.create({
      username: data.username,
      password_hash: hashedPassword,
      role: data.role || "user",
    });
  }

  // Ambil semua user
  async getAll() {
    return await User.findAll({
      attributes: { exclude: ["password_hash"] },
      order: [["id", "ASC"]],
    });
  }

  // Ambil user by ID
  async getById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
    });
  }

  // Cari user by username (buat login nanti)
  async getByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  // Update user
  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User tidak ditemukan");

    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }

    await user.update(data);
    return user;
  }

  // Hapus user
  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User tidak ditemukan");

    await user.destroy();
    return true;
  }
}

module.exports = new UserService();
