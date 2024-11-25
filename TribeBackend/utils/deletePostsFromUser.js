require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path to your User model
const Post = require('../models/Post'); // Adjust the path to your Post model

const uri = process.env.MONGODB_URI || 'mongodb+srv://juasosa:wpJuWMIpJI1IZMpu@tribe.efseo.mongodb.net/tribe?retryWrites=true&w=majority&appName=TRIBE';

if (!uri) {
  console.error('La URI de MongoDB no está definida en el archivo .env');
  process.exit(1);
}

async function deletePostsForUser(email) {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión exitosa a MongoDB!');

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`Usuario con email ${email} no encontrado.`);
      return;
    }

    // Delete posts by user ID
    const result = await Post.deleteMany({ userId: user._id });
    console.log(`Posts eliminados: ${result.deletedCount}`);
  } catch (error) {
    console.error('Error deleting posts:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Conexión MongoDB cerrada');
  }
}

// Run the delete function for the specified user email
deletePostsForUser('juanisosa442@gmail.com');