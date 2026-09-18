const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    items: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    paymentMethod: {
      type: DataTypes.ENUM('card', 'bank_transfer', 'cod', 'mobile_wallet'),
      defaultValue: 'card',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    orderStatus: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'pattern_drafted',
        'leather_cutting',
        'stitching',
        'quality_check',
        'dispatched',
        'delivered',
        'cancelled'
      ),
      defaultValue: 'pending',
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    shippingCost: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (order) => {
        if (!order.orderNumber) {
          const prefix = 'VA';
          const timestamp = Date.now().toString(36).toUpperCase();
          const random = Math.random().toString(36).substring(2, 6).toUpperCase();
          order.orderNumber = `${prefix}-${timestamp}-${random}`;
        }
      },
    },
  }
);

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  return values;
};

module.exports = Order;
