const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Product = require('./Product');

const Wishlist = sequelize.define(
  'Wishlist',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    products: {
      type: DataTypes.JSONB,
      defaultValue: [], // Array of { productId, addedAt }
    },
  },
  {
    timestamps: true,
  }
);

Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Wishlist.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  return values;
};

module.exports = Wishlist;
