const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SiteSetting = sequelize.define(
  'SiteSetting',
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = SiteSetting;
