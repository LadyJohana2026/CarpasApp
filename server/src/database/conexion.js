const mongoose = require('mongoose');

async function conectarDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI no está definida en el archivo .env');
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Atlas conectado → base de datos: ecommerce');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    throw error;
  }
}

module.exports = conectarDB;
