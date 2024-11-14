require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { getCityFromCoordinates } = require('./osmGeocoder');

// Verificar la disponibilidad de la variable de entorno
if (!process.env.MONGODB_URI) {
  console.error('Error: La variable MONGODB_URI no está definida en el archivo .env');
  process.exit(1);
}

// Function to get random Picsum URL
function getRandomPicsumUrl() {
  return `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;
}

// Function to generate mockup users
async function generateMockupUsers() {
  const userData = [
    {
      name: 'John',
      lastName: 'Doe',
      nickName: 'SunsetLover',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Lover of sunsets and nature.',
    },
    {
      name: 'Jane',
      lastName: 'Smith',
      nickName: 'FoodLover',
      email: 'jane.smith@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Food enthusiast and traveler.',
    },
    {
      name: 'Alice',
      lastName: 'Johnson',
      nickName: 'NatureExplorer',
      email: 'alice.johnson@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Explorer of nature and wildlife.',
    },
    {
      name: 'Bob',
      lastName: 'Brown',
      nickName: 'TechGuru',
      email: 'bob.brown@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Tech enthusiast and gadget lover.',
      gamificationLevel: 'Expert',
      following: [],
      followers: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
    },
    {
      name: 'Charlie',
      lastName: 'Davis',
      nickName: 'FitnessFreak',
      email: 'charlie.davis@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Fitness enthusiast and health nut.',
    },
    {
      name: 'Diana',
      lastName: 'Evans',
      nickName: 'BookWorm',
      email: 'diana.evans@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Avid reader and book lover.',
    },
    {
      name: 'Eve',
      lastName: 'Foster',
      nickName: 'TravelBug',
      email: 'eve.foster@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Travel enthusiast and globetrotter.',
    },
    {
      name: 'Frank',
      lastName: 'Green',
      nickName: 'MusicLover',
      email: 'frank.green@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Music enthusiast and concert goer.',
    },
    {
      name: 'Grace',
      lastName: 'Harris',
      nickName: 'ArtLover',
      email: 'grace.harris@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Art enthusiast and gallery visitor.',
    },
    {
      name: 'Henry',
      lastName: 'Irvine',
      nickName: 'ChefMaster',
      email: 'henry.irvine@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Master chef and food critic.',
    },
  ];

  return userData;
}

// Function to generate mockup comments
async function generateMockupComments(users, postIds) {
  const commentData = [
    {
      userId: users[0]._id,
      postId: postIds[0],
      comment: "Stunning view!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[1]._id,
      postId: postIds[1],
      comment: "Looks yummy!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[2]._id,
      postId: postIds[2],
      comment: "Amazing experience!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[3]._id,
      postId: postIds[3],
      comment: "Great review!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[4]._id,
      postId: postIds[4],
      comment: "Inspiring workout!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[5]._id,
      postId: postIds[5],
      comment: "Loved the book recommendations!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[6]._id,
      postId: postIds[6],
      comment: "Beautiful travel photos!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[7]._id,
      postId: postIds[7],
      comment: "Fantastic concert!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return commentData;
}

// Function to generate mockup posts
async function generateMockupPosts(users, commentIds, postIds) {
  const postData = [
    {
      _id: postIds[0],
      userId: users[0]._id,
      description: "A beautiful sunset over the mountains.",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl(), getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: -34.6037,
        longitude: -58.3816,
        city: await getCityFromCoordinates(-34.6037, -58.3816)
      },
      likes: 150,
      lastComment: commentIds[0],
      totalComments: 1,
      createdAt: new Date(),
    },
    {
      _id: postIds[1],
      userId: users[1]._id,
      description: "Delicious homemade pizza!",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        city: await getCityFromCoordinates(40.7128, -74.0060)
      },
      likes: 200,
      lastComment: commentIds[1],
      totalComments: 1,
      createdAt: new Date(),
    },
    {
      _id: postIds[2],
      userId: users[2]._id,
      description: "Exploring the wild forest.",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: 36.7783,
        longitude: -119.4179,
        city: await getCityFromCoordinates(36.7783, -119.4179)
      },
      likes: 120,
      lastComment: commentIds[2],
      totalComments: 1,
      createdAt: new Date(),
    },
    {
      _id: postIds[3],
      userId: users[3]._id,
      description: "Latest tech gadgets review.",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: 34.0522,
        longitude: -118.2437,
        city: await getCityFromCoordinates(34.0522, -118.2437)
      },
      likes: 95,
      lastComment: commentIds[3],
      totalComments: 1,
      createdAt: new Date(),
    },
    {
      _id: postIds[4],
      userId: users[4]._id,
      description: "Morning workout routine.",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: 51.5074,
        longitude: -0.1278,
        city: await getCityFromCoordinates(51.5074, -0.1278)
      },
      likes: 180,
      lastComment: commentIds[4],
      totalComments: 1,
      createdAt: new Date(),
    },
    {
      _id: postIds[5],
      userId: users[5]._id,
      description: "Top 10 books to read this year.",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        city: await getCityFromCoordinates(48.8566, 2.3522)
      },
      likes: 210,
      lastComment: commentIds[5],
      totalComments: 1,
      createdAt: new Date(),
    },
    {
      _id: postIds[6],
      userId: users[6]._id,
      description: "Traveling to the Alps.",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: 46.6034,
        longitude: 1.8883,
        city: await getCityFromCoordinates(46.6034, 1.8883)
      },
      likes: 130,
      lastComment: commentIds[6],
      totalComments: 1,
      createdAt: new Date(),
    },
    {
      _id: postIds[7],
      userId: users[7]._id,
      description: "Live concert experience.",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: 40.7306,
        longitude: -73.9352,
        city: await getCityFromCoordinates(40.7306, -73.9352)
      },
      likes: 175,
      lastComment: commentIds[7],
      totalComments: 1,
      createdAt: new Date(),
    },
    {
      _id: postIds[8],
      userId: users[8]._id,
      description: "Visiting the art gallery.",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: 35.6895,
        longitude: 139.6917,
        city: await getCityFromCoordinates(35.6895, 139.6917)
      },
      likes: 85,
      lastComment: null,
      totalComments: 0,
      createdAt: new Date(),
    },
    {
      _id: postIds[9],
      userId: users[9]._id,
      description: "Cooking masterclass.",
      multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        city: await getCityFromCoordinates(37.7749, -122.4194)
      },
      likes: 140,
      lastComment: null,
      totalComments: 0,
      createdAt: new Date(),
    },
  ];

  return postData;
}

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 900000, // 30 seconds
      socketTimeoutMS: 900000, // 30 seconds
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}

// Function to close MongoDB connection
async function closeDatabaseConnection() {
  try {
    await mongoose.connection.close();
    console.log('Conexión MongoDB cerrada');
  } catch (error) {
    console.error('Error al cerrar la conexión a MongoDB:', error);
  }
}

// Function to generate and insert mockup data
async function generateMockupData() {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Generate mockup users
    const userData = await generateMockupUsers();
    const insertedUsers = await User.insertMany(userData);
    console.log('Los datos de usuario de mockup se insertaron correctamente');

    // Generate post IDs first
    const postIds = Array.from({ length: 10 }, () => new mongoose.Types.ObjectId());

    // Generate mockup comments
    const commentData = await generateMockupComments(insertedUsers, postIds);
    const insertedComments = await Comment.insertMany(commentData);
    console.log('Los datos de comentario de mockup se insertaron correctamente');

    // Extract the ObjectIds of the inserted comments
    const commentIds = insertedComments.map(comment => comment._id);

    // Generate mockup posts
    const postData = await generateMockupPosts(insertedUsers, commentIds, postIds);
    await Post.insertMany(postData);
    console.log('Los datos de post de mockup se insertaron correctamente');

    // Close the MongoDB connection
    await closeDatabaseConnection();
  } catch (error) {
    console.error('Error al generar datos de mockup:', error);
    process.exit(1);
  }
}

// Run the generateMockupData function
generateMockupData();