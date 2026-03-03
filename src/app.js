const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // <--- tambahkan ini
const sequelize = require("./config/database");
const routes = require("./routes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // <--- aktifkan CORS (default: allow all origins)

// Routes
app.use("/api", routes);

// Sync DB
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("❌ DB error:", err));

// Error handling middleware (wajib di akhir)
app.use((err, req, res, next) => {
  console.error("🚨 Terjadi error:", err.stack); // tampil hanya di console backend
  res.status(500).json({
    message: "Internal Server Error", // respon aman untuk frontend
  });
});

module.exports = app;
