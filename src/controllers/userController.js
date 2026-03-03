const userService = require("../services/userService");
const { successResponse, errorResponse } = require("../utils/response");

class UserController {
  async create(req, res) {
    try {
      const data = await userService.create(req.body);
      return successResponse(res, data, "User berhasil dibuat");
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  async getAll(req, res) {
    try {
      const data = await userService.getAll();
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  async getById(req, res) {
    try {
      const data = await userService.getById(req.params.id);
      if (!data) return errorResponse(res, "User tidak ditemukan", 404);
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  async update(req, res) {
    try {
      const data = await userService.update(req.params.id, req.body);
      return successResponse(res, data, "User berhasil diperbarui");
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  async delete(req, res) {
    try {
      await userService.delete(req.params.id);
      return successResponse(res, null, "User berhasil dihapus");
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }
}

module.exports = new UserController();
