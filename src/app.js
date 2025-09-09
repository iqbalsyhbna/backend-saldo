const express = require("express");
const bodyParser = require("body-parser");
const saldoRoutes = require("./routes/saldoRoutes");
const sequelize = require("./config/database");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/api/saldo", saldoRoutes);

// Sync DB
sequelize.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch(err => console.error("DB error:", err));

module.exports = app;
