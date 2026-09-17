const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      trim: true, // e.g. "1.3mm Gauge • Dual Asymmetric Raccagni Zips"
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String, // Brief text for product cards
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    compareAtPrice: {
      type: Number, // Original price for showing discount
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Product images (Cloudinary URLs)
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Cloudinary public ID for deletion
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    // Material & spec details (especially for leather products)
    material: {
      type: String, // e.g. "Full-Grain Aniline Cowhide", "500 GSM French Terry"
    },
    materialTag: {
      type: String, // e.g. "GENUINE ITALIAN STEERHIDE", "NATURAL MERINO SHEARLING"
    },
    hideGauge: {
      type: String, // e.g. "1.3mm", "1.4mm"
    },
    // Available sizes
    sizes: [
      {
        label: { type: String, required: true }, // S, M, L, XL, XXL, 3XL
        inStock: { type: Number, default: 0 },
      },
    ],
    // Color variants
    colors: [
      {
        name: { type: String },
        hex: { type: String }, // e.g. "#000000"
        swatch: { type: String }, // Cloudinary URL for swatch image
      },
    ],
    // Badges & tags
    badges: [
      {
        type: String, // e.g. "READY TO SHIP", "MADE-TO-ORDER", "ARMOR-READY (CE 2)"
      },
    ],
    availabilityTag: {
      type: String, // e.g. "ARTISAN BESTSELLER", "10-DAY BUILD", "ONLY 3 LEFT IN RUN"
    },
    // Ratings
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    // Tailoring options
    isTailored: {
      type: Boolean,
      default: false, // If true, shows "+Tailored" and "CUSTOM SIZE" button
    },
    isMadeToOrder: {
      type: Boolean,
      default: false,
    },
    buildTime: {
      type: String, // e.g. "10-DAY BUILD"
    },
    // Additional features
    features: [String], // e.g. ["CE Level 2 D3O® Impact Compatibility", "100% Full-Grain Aniline"]
    // Armor package (for motorbike)
    armorPackage: {
      available: { type: Boolean, default: false },
      description: String,
      price: Number,
    },
    // Stock management
    totalStock: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // SEO
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
  }
);

// Generate slug from name before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search & filtering
productSchema.index({ name: 'text', description: 'text', material: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
