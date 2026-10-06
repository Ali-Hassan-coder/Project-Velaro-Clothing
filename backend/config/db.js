const { Sequelize } = require('sequelize');

const dialectOptions = process.env.DATABASE_URL || process.env.PG_SSL === 'true' || process.env.PG_HOST?.includes('supabase.co')
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? false : false,
      dialectOptions,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize(
      process.env.PG_DATABASE || 'velaro_clothing',
      process.env.PG_USER || 'postgres',
      process.env.PG_PASSWORD || '1234',
      {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? false : false,
        dialectOptions,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ PostgreSQL database connected successfully.`);
    // Sync models
    try {
      await sequelize.sync();
      console.log(`✅ PostgreSQL tables synchronized.`);
    } catch (syncErr) {
      console.warn(`⚠️ PostgreSQL sync notice: ${syncErr.message}`);
    }
  } catch (error) {
    console.error(`❌ PostgreSQL connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
