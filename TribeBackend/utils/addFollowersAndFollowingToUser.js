require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path to your User model

const uri = process.env.MONGODB_URI || 'mongodb+srv://juasosa:wpJuWMIpJI1IZMpu@tribe.efseo.mongodb.net/tribe?retryWrites=true&w=majority&appName=TRIBE';

if (!uri) {
  console.error('La URI de MongoDB no está definida en el archivo .env');
  process.exit(1);
}

async function updateUserFollowersAndFollowing(email) {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión exitosa a MongoDB!');

    // Fetch all users
    const allUsers = await User.find({});
    const allUserIds = allUsers.map(user => user._id);

    // Find the user with the specified email
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`Usuario con email ${email} no encontrado`);
      return;
    }

    // Update the following and followers arrays
    user.following = allUserIds;
    user.followers = allUserIds;

    // Save the updated user
    await user.save();
    console.log(`Usuario ${email} actualizado con éxito`);

  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Conexión MongoDB cerrada');
  }
}

// Run the update function for the specified user email
updateUserFollowersAndFollowing('');