require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { getCityFromCoordinates } = require('./osmGeocoder');

// Function to get random Picsum URL
function getRandomPicsumUrl() {
  return `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;
}

// Function to generate mockup users
async function generateMockupUsers() {
  const userData = [
    {
      name: 'Sergio',
      lastName: 'Doe',
      nickName: 'SunsetSergio',
      email: 'sergio.doe@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'I love sunsets!',
      gamificationLevel: 'Beginner',
      following: [],
      followers: [],
      favorites: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
    },
  ];

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 900000, // 30 seconds
      socketTimeoutMS: 900000, // 30 seconds
    });
    console.log('Connected to MongoDB');


    const insertedUsers = await User.insertMany(userData);
    console.log('Mockup user data inserted successfully');
    
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    return insertedUsers;
  } catch (error) {
    console.error('Error generating mockup data:', error);
    process.exit(1);
  }
}

// Function to generate mockup data
async function generateMockupData() {
  // Generate mockup users
  const users = await generateMockupUsers();

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 900000, // 30 seconds
      socketTimeoutMS: 900000, // 30 seconds
    });
    console.log('Connected to MongoDB');
 
    // Mockup post data
    const postData = [
      {
        userId: users[0]._id,
        nickname: users[0].nickName,
        profilePicture: users[0].profileImage,
        description: "A beautiful sunset in the city.",
        multimedia: [getRandomPicsumUrl()],
        location: {
          latitude: -34.6037,
          longitude: -58.3816,
          city: await getCityFromCoordinates(-34.6037, -58.3816)
        },
        likes: 150,
        comments: [],
        createdAt: new Date(),
      },
    ];

    // Insert mockup post data into the database
    await Post.insertMany(postData);
    console.log('Mockup post data inserted successfully');

    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error generating mockup data:', error);
    process.exit(1);
  }
}

// Run the generateMockupData function
generateMockupData();