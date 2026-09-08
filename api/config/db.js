// -----------------------------------------------------------------------------
// @desc    Conexión a la base de datos MongoDB mediante Mongoose
// -----------------------------------------------------------------------------
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🍃 MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
    // Detener la aplicación si falla la conexión crítica
    process.exit(1);
  }
};

module.exports = connectDB;
