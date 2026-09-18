const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./Category');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    compareAtPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialTag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hideGauge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sizes: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    colors: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    badges: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    availabilityTag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    numReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isTailored: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isMadeToOrder: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    buildTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    armorPackage: {
      type: DataTypes.JSONB,
      defaultValue: { available: false },
    },
    totalStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (prod) => {
        if (prod.name && !prod.slug) {
          prod.slug = prod.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
      },
    },
  }
);

// Associations
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

Product.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  if (values.category && values.category.toJSON) {
    values.category = values.category.toJSON();
  }
  return values;
};

module.exports = Product;
