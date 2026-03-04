const cron = require("node-cron");
const moment = require("moment");
const Saldo = require("../models/saldo");

async function generateTodaySaldo() {
  try {
    const todayMoment = moment();
    const day = todayMoment.day();

    // 🔥 Skip Sabtu & Minggu
    if (day === 0 || day === 6) {
      console.log("⏭ Weekend - tidak generate saldo");
      return;
    }

    const today = todayMoment.format("YYYY-MM-DD");

    const existing = await Saldo.findOne({
      where: { tanggal: today },
    });

    if (existing) {
      console.log(`⚠️ Saldo ${today} sudah ada`);
      return;
    }

    await Saldo.create({
      tanggal: today,
      penerimaan_rkud: 0,
      pengeluaran_rkud: 0,
      saldo_rkud: 0,
      penerimaan_sipd: 0,
      pengeluaran_sipd: 0,
      keterangan: null,
    });

    console.log(`✅ Saldo otomatis dibuat untuk ${today}`);
  } catch (err) {
    console.error("❌ Error generate saldo:", err.message);
  }
}

/*
  Cron jalan setiap hari jam 00:05
  Format: menit jam tanggal bulan hari
*/
cron.schedule("5 0 * * *", async () => {
  console.log("⏰ Cron saldo jalan...");
  await generateTodaySaldo();
});

// OPTIONAL: supaya kalau server restart siang hari tetap aman
generateTodaySaldo();

module.exports = {};