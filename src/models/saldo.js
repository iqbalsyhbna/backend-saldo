const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Saldo = sequelize.define("Saldo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  penerimaan_rkud: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0,
  },
  pengeluaran_rkud: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0,
  },
  saldo_rkud: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0,
  },
  penerimaan_sipd: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0,
  },
  pengeluaran_sipd: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0,
  },
}, {
  tableName: "saldo",
  timestamps: true,
});

module.exports = Saldo;
