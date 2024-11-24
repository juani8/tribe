require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path to your User model

const uri = process.env.MONGODB_URI || 'mongodb+srv://juasosa:wpJuWMIpJI1IZMpu@tribe.efseo.mongodb.net/tribe?retryWrites=true&w=majority&appName=TRIBE';

if (!uri) {
  console.error('La URI de MongoDB no está definida en el archivo .env');
  process.exit(1);
}

async function connection() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión exitosa a MongoDB!');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    process.exit(1);
  }
}

async function logAllUsers() {
  try {
    const users = await User.find({});
    console.log(users);
  } catch (error) {
    console.error('Error al obtener los documentos de usuario:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Conexión MongoDB cerrada');
  }
}

connection().then(logAllUsers);

module.exports = connection;