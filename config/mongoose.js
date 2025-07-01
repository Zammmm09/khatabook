const mongoose = require('mongoose');
require('dotenv').config(); // ✅ important!

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ✅ using env
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
