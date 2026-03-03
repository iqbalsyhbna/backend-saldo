const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["username"],
        name: "unique_username",
      },
    ],
  }
);

module.exports = User;
