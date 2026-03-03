// controllers/authController.js
const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await userService.getByUsername(username);

      if (!user) return res.status(401).json({ message: "User tidak ditemukan" });

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) return res.status(401).json({ message: "Password salah" });

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
