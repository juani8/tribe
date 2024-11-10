require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('La URI de MongoDB no está definida en el archivo .env');
  process.exit(1);
}

async function connection() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Conexión exitosa a MongoDB!');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connection;
 