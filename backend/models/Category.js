const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    shortDescription: {
      type: String, // Brief text for category cards on homepage
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    // Division number & label (matching design: "01 // LEATHER JACKETS")
    divisionNumber: {
      type: String, // "01", "02", "03", etc.
    },
    divisionLabel: {
      type: String, // "FLAGSHIP LINE", "500 GSM LOOPBACK", etc.
    },
    // Category-specific badge
    badge: {
      type: String, // e.g. "FLAGSHIP LINE", "500 GSM LOOPBACK"
    },
    // CTA link text
    ctaText: {
      type: String,
      default: 'VIEW COLLECTION →',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
categorySchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

categorySchema.index({ slug: 1 });
categorySchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
