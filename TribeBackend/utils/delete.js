const mongoose = require('mongoose');
const User = require('../models/User');

async function deleteUsersByEmail() {
  try {
    await mongoose.connect('mongodb+srv://juasosa:wpJuWMIpJI1IZMpu@tribe.efseo.mongodb.net/?retryWrites=true&w=majority&appName=TRIBE', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const result = await User.deleteMany({
      email: { $in: ['jotacaos2002@gmail.com', 'juanisosa442@gmail.com'] }
    });

    console.log(`${result.deletedCount} documents deleted.`);
  } catch (error) {
    console.error('Error deleting users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Example usage
deleteUsersByEmail('user1@example.com', 'user2@example.com');