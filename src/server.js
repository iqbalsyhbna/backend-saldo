const app = require("./app");
require("dotenv").config();

// Import cron (langsung jalan otomatis)
require("./cron/saldoCron");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});