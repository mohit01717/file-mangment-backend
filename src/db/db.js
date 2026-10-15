const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("db connected");
  } catch (error) {
    console.log("Error message", error.message);
    process.exit(1);
  }
}

module.exports = connectDb;
