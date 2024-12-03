require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path to your User model

const uri = process.env.MONGODB_URI || 'mongodb+srv://juasosa:wpJuWMIpJI1IZMpu@tribe.efseo.mongodb.net/tribe?retryWrites=true&w=majority&appName=TRIBE';

if (!uri) {
  console.error('La URI de MongoDB no está definida en el archivo .env');
  process.exit(1);
}

async function deleteUserByEmail(email) {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión exitosa a MongoDB!');

    // Find and delete the user by email
    const result = await User.findOneAndDelete({ email });
    if (result) {
      console.log(`Usuario con email ${email} eliminado:`, result);
    } else {
      console.log(`Usuario con email ${email} no encontrado.`);
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Conexión MongoDB cerrada');
  }
}

// Run the deleteUserByEmail function for the specified user email
const email = 'juanisosa442@gmail.com'; // Replace with the actual user email
deleteUserByEmail(email);