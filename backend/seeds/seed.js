const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { sequelize, connectDB } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing tables
    await Wishlist.destroy({ where: {}, truncate: { cascade: true } });
    await Order.destroy({ where: {}, truncate: { cascade: true } });
    await Product.destroy({ where: {}, truncate: { cascade: true } });
    await Category.destroy({ where: {}, truncate: { cascade: true } });
    await User.destroy({ where: {}, truncate: { cascade: true } });
    console.log('🗑️  Cleared existing PostgreSQL data');

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
      firstName: 'Sterling',
      lastName: 'Archer',
      email: 'customer@test.com',
      password: 'customer123',
      role: 'customer',
    });
    console.log('👤 Test customer created: customer@test.com / customer123');

    // Create categories (using authentic photos from the design pack)
    const categories = await Category.bulkCreate(
      [
        {
          name: 'Leather Jackets',
          slug: 'leather-jackets',
          description: 'Café racers, double-breasted riders, and minimalist bombers cut from 1.4mm vegetable-tanned hides with Japanese Excella brass zippers.',
          shortDescription: 'Artisanal Outerwear',
          image: { url: '/photo_1.jpg' },
          divisionNumber: '01',
          divisionLabel: 'FLAGSHIP LINE',
          badge: 'FLAGSHIP LINE',
          ctaText: 'EXPLORE 28 SILHOUETTES →',
          displayOrder: 1,
        },
        {
          name: 'Hoodies & Fleece',
          slug: 'hoodies-sweatshirts',
          description: 'Custom-milled ultra-dense combed cotton featuring pre-shrunk architectural box cuts and hand-stitched guild marks.',
          shortDescription: 'Heavyweight Hoodies',
          image: { url: '/photo11.jpg' },
          divisionNumber: '02',
          divisionLabel: '500 GSM LOOPBACK',
          badge: '500 GSM LOOPBACK',
          ctaText: 'SHOP HEAVY FLEECE →',
          displayOrder: 2,
        },
        {
          name: 'Streetwear',
          slug: 'streetwear',
          description: 'Raw 14oz Japanese denim, articulated technical cargos, and heavyweight combed tees.',
          shortDescription: 'Streetwear Division',
          image: { url: '/photo4.jpg' },
          divisionNumber: '03',
          divisionLabel: 'APPAREL',
          badge: 'ARCHITECTURAL DENIM',
          ctaText: 'VIEW COLLECTION →',
          displayOrder: 3,
        },
        {
          name: 'Sportswear',
          slug: 'sportswear',
          description: 'Anatomical compression bases, moisture-vented tracksuits, and gym kits built for velocity.',
          shortDescription: 'Performance Lab',
          image: { url: '/photo12.jpg' },
          divisionNumber: '04',
          divisionLabel: 'TECHNICAL',
          badge: 'COMPRESSION LAB',
          ctaText: 'DISCOVER TECHWEAR →',
          displayOrder: 4,
        },
        {
          name: 'Motorbike Suits',
          slug: 'motorbike-riding-suits',
          description: '1-Piece 1.0mm Kangaroo hides in carbon black and atelier gold accents, aerodynamic speed humps, and titanium shoulder sliders.',
          shortDescription: 'Motorbike Race Suits',
          image: { url: '/photo5.jpg' },
          divisionNumber: '05',
          divisionLabel: 'TRACK ARMOR',
          badge: 'CE LEVEL 2',
          ctaText: 'CONFIGURE SUIT →',
          displayOrder: 5,
        },
      ],
      { returning: true }
    );
    console.log(`📁 ${categories.length} categories created`);

    // Create sample products mapped to actual photos from the project
    const products = await Product.bulkCreate(
      [
        {
          name: 'The Sovereign Asymmetric Biker',
          slug: 'the-sovereign-asymmetric-biker',
          subtitle: '1.3mm Gauge • Dual Asymmetric Raccagni Zips',
          description: 'Engineered from 1.2mm–1.4mm vegetable-tanned hides, finished with custom machined brass hardware and quilted silk-viscose or Icelandic sheepskin linings.',
          shortDescription: 'Hand-burnished Italian steerhide biker jacket.',
          price: 895.0,
          compareAtPrice: 1150.0,
          categoryId: categories[0].id,
          sku: 'VA-LJ-0891',
          material: 'Full-Grain Aniline Cowhide',
          materialTag: 'GENUINE ITALIAN STEERHIDE',
          hideGauge: '1.3mm',
          images: [
            { url: '/photo_1.jpg', alt: 'Sovereign Asymmetric Biker Front', isPrimary: true },
            { url: '/photo_2.jpg', alt: 'Sovereign Asymmetric Biker Back' },
            { url: '/image_3.jpg', alt: 'Sovereign Detail' },
          ],
          sizes: [
            { size: 'S', label: 'S', inStock: 4 },
            { size: 'M', label: 'M', inStock: 7 },
            { size: 'L', label: 'L', inStock: 3 },
            { size: 'XL', label: 'XL', inStock: 5 },
            { size: 'XXL', label: 'XXL', inStock: 2 },
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
          slug: 'modena-1968-cafe-racer',
          subtitle: '1.2mm Supple Temper • Gusseted Shoulder Action-Back',
          description: 'A tribute to the golden age of café racing. French naked calfskin with a supple 1.2mm temper and gusseted shoulder construction.',
          shortDescription: 'Classic café racer silhouette in naked calfskin.',
          price: 760.0,
          compareAtPrice: 920.0,
          categoryId: categories[0].id,
          sku: 'VA-LJ-0760',
          material: 'French Naked Calfskin',
          materialTag: 'FRENCH NAKED CALFSKIN',
          hideGauge: '1.2mm',
          images: [
            { url: '/photo_2.jpg', alt: 'Modena Café Racer', isPrimary: true },
            { url: '/photo_1.jpg', alt: 'Modena Detail' },
          ],
          sizes: [
            { size: 'S', label: 'S', inStock: 3 },
            { size: 'M', label: 'M', inStock: 5 },
            { size: 'L', label: 'L', inStock: 4 },
            { size: 'XL', label: 'XL', inStock: 2 },
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
          slug: 'guild-loopback-hoodie',
          subtitle: '500 GSM French Terry • Architectural Box Cut',
          description: 'Custom-milled ultra-dense combed cotton featuring pre-shrunk architectural box cuts and hand-stitched guild marks.',
          shortDescription: '500 GSM heavyweight French terry box cut hoodie.',
          price: 240.0,
          categoryId: categories[1].id,
          sku: 'VG-HDY-0240',
          material: '500 GSM French Terry',
          materialTag: '500 GSM FRENCH TERRY',
          images: [
            { url: '/photo11.jpg', alt: 'Guild Loopback Hoodie', isPrimary: true },
            { url: '/photo6.jpg', alt: 'Guild Hoodie Detail' },
          ],
          sizes: [
            { size: 'S', label: 'S', inStock: 8 },
            { size: 'M', label: 'M', inStock: 15 },
            { size: 'L', label: 'L', inStock: 22 },
            { size: 'XL', label: 'XL', inStock: 11 },
            { size: 'XXL', label: 'XXL', inStock: 6 },
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
          slug: 'v-brutalist-modular-cargos',
          subtitle: '14oz Raw Selvedge • Magnetic Gusset Pocket System',
          description: 'Raw 14oz Japanese denim with articulated technical pockets, reinforced knee panels, and FIDLOCK magnetic closures.',
          shortDescription: 'Japanese selvedge denim technical modular cargos.',
          price: 420.0,
          categoryId: categories[2].id,
          sku: 'VG-STW-CARG',
          material: 'Raw 14oz Japanese Denim',
          materialTag: 'STREETWEAR DENIM',
          images: [
            { url: '/photo4.jpg', alt: 'Brutalist Modular Cargos', isPrimary: true },
            { url: '/photo_7.jpg', alt: 'Cargo Detail' },
          ],
          sizes: [
            { size: 'S', label: 'S', inStock: 12 },
            { size: 'M', label: 'M', inStock: 18 },
            { size: 'L', label: 'L', inStock: 9 },
            { size: 'XL', label: 'XL', inStock: 4 },
            { size: 'XXL', label: 'XXL', inStock: 2 },
          ],
          rating: 4.7,
          numReviews: 42,
          isFeatured: true,
          totalStock: 45,
        },
        {
          name: 'Velocity Membrane Windshell',
          slug: 'velocity-membrane-windshell',
          subtitle: 'Hydrophobic 3-Layer Shell • Laser Cut Venting',
          description: 'Technical membrane windshell with moisture-vented panels, waterproof YKK Aquaguard zips, and reflective detailing.',
          shortDescription: 'Weatherproof technical running and training shell.',
          price: 340.0,
          categoryId: categories[3].id,
          sku: 'VG-SPT-WND04',
          material: 'Technical Membrane',
          materialTag: 'SPORTSWEAR LAB',
          images: [
            { url: '/photo12.jpg', alt: 'Velocity Windshell', isPrimary: true },
            { url: '/photo10.jpg', alt: 'Windshell Detail' },
          ],
          sizes: [
            { size: 'S', label: 'S', inStock: 6 },
            { size: 'M', label: 'M', inStock: 11 },
            { size: 'L', label: 'L', inStock: 5 },
            { size: 'XL', label: 'XL', inStock: 3 },
          ],
          rating: 4.5,
          numReviews: 19,
          isFeatured: true,
          totalStock: 25,
        },
        {
          name: 'Apex Velocity 1-Piece Suit',
          slug: 'apex-velocity-1-piece-suit',
          subtitle: 'Full Biomechanical Rig • 1.0mm Kangaroo Hide',
          description: '1-Piece 1.0mm Kangaroo hides with aerodynamic speed humps and titanium shoulder sliders. CE Level 2 certified for professional circuit racing.',
          shortDescription: 'CE AAA certified kangaroo leather race suit with armor system.',
          price: 2450.0,
          compareAtPrice: 2800.0,
          categoryId: categories[4].id,
          sku: 'VG-MOT-APX',
          material: '1.0mm Kangaroo Hide',
          materialTag: 'CE LEVEL 2 CERTIFIED',
          hideGauge: '1.0mm',
          images: [
            { url: '/photo5.jpg', alt: 'Apex Velocity Suit', isPrimary: true },
            { url: '/photo_7.jpg', alt: 'Armor Detail' },
            { url: '/photo10.jpg', alt: 'Circuit Action' },
          ],
          sizes: [
            { size: 'S', label: 'S', inStock: 2 },
            { size: 'M', label: 'M', inStock: 3 },
            { size: 'L', label: 'L', inStock: 2 },
            { size: 'XL', label: 'XL', inStock: 1 },
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
            options: [
              { name: 'D3O® Ghost Pro Impact Armor (Included)' },
              { name: 'Titanium Slider Upgrade (+$150)' },
            ],
          },
          totalStock: 8,
        },
      ],
      { returning: true }
    );
    console.log(`🛍️  ${products.length} sample products created`);

    console.log('\n🎉 Seed complete! PostgreSQL database updated with photos.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
