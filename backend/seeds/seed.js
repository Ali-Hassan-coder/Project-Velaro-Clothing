const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      firstName: 'Velaro',
      lastName: 'Admin',
      email: 'admin@velaroclothing.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log('👤 Admin user created: admin@velaroclothing.com / admin123456');

    // Create test customer
    await User.create({
      firstName: 'Test',
      lastName: 'Customer',
      email: 'customer@test.com',
      password: 'customer123',
      role: 'customer',
    });
    console.log('👤 Test customer created: customer@test.com / customer123');

    // Create categories (matching "The Five Pillars" from the design)
    const categories = await Category.insertMany([
      {
        name: 'Leather Jackets',
        description: 'Café racers, double-breasted riders, and minimalist bombers cut from 1.4mm vegetable-tanned hides with Japanese Excella brass zippers.',
        shortDescription: 'Artisanal Outerwear',
        divisionNumber: '01',
        divisionLabel: 'FLAGSHIP LINE',
        badge: 'FLAGSHIP LINE',
        ctaText: 'EXPLORE 28 SILHOUETTES →',
        displayOrder: 1,
      },
      {
        name: 'Hoodies & Fleece',
        description: 'Custom-milled ultra-dense combed cotton featuring pre-shrunk architectural box cuts and hand-stitched guild marks.',
        shortDescription: 'Heavyweight Hoodies',
        divisionNumber: '02',
        divisionLabel: '500 GSM LOOPBACK',
        badge: '500 GSM LOOPBACK',
        ctaText: 'SHOP HEAVY FLEECE →',
        displayOrder: 2,
      },
      {
        name: 'Streetwear',
        description: 'Raw 14oz Japanese denim, articulated technical cargos, and heavyweight combed tees.',
        shortDescription: 'Streetwear Division',
        divisionNumber: '03',
        divisionLabel: 'APPAREL',
        ctaText: 'VIEW COLLECTION →',
        displayOrder: 3,
      },
      {
        name: 'Sportswear',
        description: 'Anatomical compression bases, moisture-vented tracksuits, and gym kits built for velocity.',
        shortDescription: 'Performance Lab',
        divisionNumber: '04',
        divisionLabel: 'TECHNICAL',
        ctaText: 'DISCOVER TECHWEAR →',
        displayOrder: 4,
      },
      {
        name: 'Motorbike Suits',
        description: '1-Piece 1.0mm Kangaroo hides, aerodynamic speed humps, and titanium shoulder sliders.',
        shortDescription: 'Motorbike Race Suits',
        divisionNumber: '05',
        divisionLabel: 'TRACK ARMOR',
        ctaText: 'CONFIGURE SUIT →',
        displayOrder: 5,
      },
    ]);
    console.log(`📁 ${categories.length} categories created`);

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'The Sovereign Asymmetric Biker',
        subtitle: '1.3mm Gauge • Dual Asymmetric Raccagni Zips',
        description: 'Engineered from 1.2mm–1.4mm vegetable-tanned hides, finished with custom machined brass hardware and quilted silk-viscose or Icelandic sheepskin linings.',
        price: 895.00,
        category: categories[0]._id,
        sku: 'VA-LJ-0891',
        material: 'Full-Grain Aniline Cowhide',
        materialTag: 'GENUINE ITALIAN STEERHIDE',
        hideGauge: '1.3mm',
        images: [{ url: '/placeholder-jacket-1.jpg', alt: 'Sovereign Asymmetric Biker', isPrimary: true }],
        sizes: [
          { label: 'S', inStock: 4 },
          { label: 'M', inStock: 7 },
          { label: 'L', inStock: 3 },
          { label: 'XL', inStock: 5 },
          { label: 'XXL', inStock: 2 },
        ],
        colors: [
          { name: 'Midnight Black', hex: '#1a1a1a' },
          { name: 'Antique Cognac', hex: '#8B4513' },
          { name: 'Matte Raw', hex: '#6B4E3D' },
        ],
        badges: ['READY TO SHIP'],
        availabilityTag: 'ARTISAN BESTSELLER',
        rating: 4.96,
        numReviews: 48,
        isTailored: true,
        isFeatured: true,
        features: ['100% Full-Grain Aniline & Horsehide', 'CE Level 2 D3O® Impact Compatibility'],
        totalStock: 21,
      },
      {
        name: 'Modena 1968 Café Racer',
        subtitle: '1.2mm Supple Temper • Gusseted Shoulder Action-Back',
        description: 'A tribute to the golden age of café racing. French naked calfskin with a supple 1.2mm temper and gusseted shoulder construction.',
        price: 760.00,
        category: categories[0]._id,
        sku: 'VA-LJ-0760',
        material: 'French Naked Calfskin',
        materialTag: 'FRENCH NAKED CALFSKIN',
        hideGauge: '1.2mm',
        images: [{ url: '/placeholder-jacket-2.jpg', alt: 'Modena Café Racer', isPrimary: true }],
        sizes: [
          { label: 'S', inStock: 3 },
          { label: 'M', inStock: 5 },
          { label: 'L', inStock: 4 },
          { label: 'XL', inStock: 2 },
        ],
        colors: [
          { name: 'Midnight Black', hex: '#1a1a1a' },
          { name: 'Heritage Brown', hex: '#654321' },
        ],
        badges: ['MADE-TO-ORDER'],
        availabilityTag: '10-DAY BUILD',
        rating: 5.0,
        numReviews: 31,
        isTailored: true,
        isMadeToOrder: true,
        buildTime: '10-DAY BUILD',
        isFeatured: true,
        totalStock: 14,
      },
      {
        name: 'Guild Loopback Hoodie',
        subtitle: '500 GSM French Terry • Architectural Box Cut',
        description: 'Custom-milled ultra-dense combed cotton featuring pre-shrunk architectural box cuts and hand-stitched guild marks.',
        price: 240.00,
        category: categories[1]._id,
        sku: 'VG-HDY-0240',
        material: '500 GSM French Terry',
        materialTag: '500 GSM FRENCH TERRY',
        images: [{ url: '/placeholder-hoodie-1.jpg', alt: 'Guild Loopback Hoodie', isPrimary: true }],
        sizes: [
          { label: 'S', inStock: 8 },
          { label: 'M', inStock: 15 },
          { label: 'L', inStock: 22 },
          { label: 'XL', inStock: 11 },
          { label: 'XXL', inStock: 6 },
        ],
        colors: [
          { name: 'Carbon Black', hex: '#1c1c1c' },
          { name: 'Heather Grey', hex: '#808080' },
          { name: 'Bone White', hex: '#F5F0E8' },
        ],
        badges: ['READY TO SHIP'],
        rating: 5.0,
        numReviews: 118,
        isFeatured: true,
        totalStock: 62,
      },
      {
        name: 'V-Brutalist Modular Cargos',
        description: 'Raw 14oz Japanese denim with articulated technical pockets and reinforced knee panels.',
        price: 420.00,
        category: categories[2]._id,
        sku: 'VG-STW-CARG',
        material: 'Raw 14oz Japanese Denim',
        materialTag: 'STREETWEAR',
        images: [{ url: '/placeholder-cargo-1.jpg', alt: 'Brutalist Modular Cargos', isPrimary: true }],
        sizes: [
          { label: 'S', inStock: 12 },
          { label: 'M', inStock: 18 },
          { label: 'L', inStock: 9 },
          { label: 'XL', inStock: 4 },
          { label: 'XXL', inStock: 2 },
        ],
        rating: 4.7,
        numReviews: 42,
        isFeatured: true,
        totalStock: 45,
      },
      {
        name: 'Velocity Membrane Windshell',
        description: 'Technical membrane windshell with moisture-vented panels and reflective detailing.',
        price: 340.00,
        category: categories[3]._id,
        sku: 'VG-SPT-WND04',
        material: 'Technical Membrane',
        materialTag: 'SPORTSWEAR',
        images: [{ url: '/placeholder-sport-1.jpg', alt: 'Velocity Windshell', isPrimary: true }],
        sizes: [
          { label: 'S', inStock: 6 },
          { label: 'M', inStock: 11 },
          { label: 'L', inStock: 5 },
          { label: 'XL', inStock: 3 },
        ],
        rating: 4.5,
        numReviews: 19,
        isFeatured: true,
        totalStock: 25,
      },
      {
        name: 'Apex Velocity 1-Piece Suit',
        subtitle: 'Full Biomechanical Rig • 1.0mm Kangaroo Hide',
        description: '1-Piece 1.0mm Kangaroo hides with aerodynamic speed humps and titanium shoulder sliders. CE Level 2 certified.',
        price: 2450.00,
        category: categories[4]._id,
        sku: 'VG-MOT-APX',
        material: '1.0mm Kangaroo Hide',
        materialTag: 'CE LEVEL 2 CERTIFIED',
        hideGauge: '1.0mm',
        images: [{ url: '/placeholder-suit-1.jpg', alt: 'Apex Velocity Suit', isPrimary: true }],
        sizes: [
          { label: 'S', inStock: 2 },
          { label: 'M', inStock: 3 },
          { label: 'L', inStock: 2 },
          { label: 'XL', inStock: 1 },
        ],
        badges: ['CE LEVEL 2 CERTIFIED'],
        rating: 5.0,
        numReviews: 18,
        isTailored: true,
        isFeatured: true,
        armorPackage: {
          available: true,
          description: 'D3O® GHOST™ CE Level 2 Armor Package — 5-piece set',
          price: 120,
        },
        totalStock: 8,
      },
    ]);
    console.log(`🛍️  ${products.length} sample products created`);

    console.log('\n🎉 Seed complete! You can now start the server.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
