const mongoose = require('mongoose');
require('dotenv').config(); // Load .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
