require('dotenv').config({ path: '../.env' });
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI no está definida en el archivo .env');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connection() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Conexión exitosa a MongoDB!");
  } catch (error) {
    if (error.name === 'MongoNetworkError') {
      console.error('Error de red al conectar con MongoDB:', error);
    } else if (error.name === 'MongoParseError') {
      console.error('Error al analizar la URI de MongoDB:', error);
    } else {
      console.error('Error inesperado al conectar con MongoDB:', error);
    }
    process.exit(1); // Finalizar el proceso en caso de error crítico
  }
}

module.exports = connection;