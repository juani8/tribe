require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const env = process.env.NODE_ENV || 'Development';
const uri = env === 'Production' ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL;

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
    console.log(`Conexión exitosa a MongoDB en el entorno ${env}!`);
  } catch (error) {
    console.error(`Error al conectar con MongoDB en el entorno ${env}:`, error);
    process.exit(1);
  }
}

module.exports = connection;
 