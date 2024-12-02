require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const Post = require('../models/Post');

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

async function logUserBookmarks(email) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`Usuario con email ${email} no encontrado.`);
      return;
    }

    const bookmarks = await Bookmark.find({ userId: user._id }).populate('postId');
    if (bookmarks.length === 0) {
      console.log(`El usuario con email ${email} no tiene bookmarks.`);
      return;
    }

    console.log(`Bookmarks del usuario con email ${email}:`);
    bookmarks.forEach(bookmark => {
      console.log(`Post ID: ${bookmark.postId._id}, Descripción: ${bookmark.postId.description}`);
    });
  } catch (error) {
    console.error('Error al obtener los bookmarks del usuario:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión MongoDB cerrada');
  }
}

// Run the logUserBookmarks function for specific user email
const email = 'juasosa@uade.edu.ar'; // Replace with the actual user email
connection().then(() => logUserBookmarks(email));