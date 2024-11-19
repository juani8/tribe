require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path to your User model

const uri = 'mongodb+srv://juasosa:wpJuWMIpJI1IZMpu@tribe.efseo.mongodb.net/tribe?retryWrites=true&w=majority&appName=TRIBE';


if (!uri) {
  console.error('La URI de MongoDB no está definida en el archivo .env');
  process.exit(1);
}

async function updateImagesForSpecificUsers() {
  const randomImageUrl = () => `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;

  try {
    // Connect to the MongoDB database
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión exitosa a MongoDB!');

    // Update the profileImage and coverImage for specific users
    await User.updateMany(
      { email: { $in: ['a@a.com', 'juanisosa442@gmail.com'] } },
      {
        $set: {
          profileImage: randomImageUrl(),
          coverImage: randomImageUrl()
        }
      }
    );
    console.log('Images updated successfully');
  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Conexión MongoDB cerrada');
  }
}

// Run the update function
updateImagesForSpecificUsers();