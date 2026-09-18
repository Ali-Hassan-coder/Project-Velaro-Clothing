const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.JSONB,
      defaultValue: { url: '', publicId: '' },
    },
    divisionNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    divisionLabel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    badge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ctaText: {
      type: DataTypes.STRING,
      defaultValue: 'VIEW COLLECTION →',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    productCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (cat) => {
        if (cat.name && !cat.slug) {
          cat.slug = cat.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      },
    },
  }
);

Category.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  return values;
};

module.exports = Category;
