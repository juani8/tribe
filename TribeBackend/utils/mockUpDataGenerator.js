require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { getCityFromCoordinates } = require('./osmGeocoder');

// Function to get random Picsum URL
function getRandomPicsumUrl() {
  return `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;
}

// Function to generate mockup data
async function generateMockupData() {
  // Mockup comment data
  const commentData = [
    {
      userId: new mongoose.Types.ObjectId(),
      nickname: "NatureLover",
      profilePicture: getRandomPicsumUrl(),
      postId: new mongoose.Types.ObjectId(),
      comment: "Stunning view!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: new mongoose.Types.ObjectId(),
      nickname: "FoodLover",
      profilePicture: getRandomPicsumUrl(),
      postId: new mongoose.Types.ObjectId(),
      comment: "Looks yummy!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: new mongoose.Types.ObjectId(),
      nickname: "NatureLover",
      profilePicture: getRandomPicsumUrl(),
      postId: new mongoose.Types.ObjectId(),
      comment: "Stunning view!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: new mongoose.Types.ObjectId(),
      nickname: "FoodLover",
      profilePicture: getRandomPicsumUrl(),
      postId: new mongoose.Types.ObjectId(),
      comment: "Looks yummy!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: new mongoose.Types.ObjectId(),
      nickname: "NatureLover",
      profilePicture: getRandomPicsumUrl(),
      postId: new mongoose.Types.ObjectId(),
      comment: "Stunning view!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: new mongoose.Types.ObjectId(),
      nickname: "FoodLover",
      profilePicture: getRandomPicsumUrl(),
      postId: new mongoose.Types.ObjectId(),
      comment: "Looks yummy!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Insert mockup comment data into the database
    const insertedComments = await Comment.insertMany(commentData);
    console.log('Mockup comment data inserted successfully');

    // Extract the ObjectIds of the inserted comments
    const commentIds = insertedComments.map(comment => comment._id);

    // Mockup post data
    const mockupData = [
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "SunsetLover",
        profilePicture: getRandomPicsumUrl(),
        description: "A beautiful sunset over the mountains.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl(), getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: -34.6037,
          longitude: -58.3816,
          city: await getCityFromCoordinates(-34.6037, -58.3816)
        },
        likes: 150,
        comments: [commentIds[0]],
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "PizzaFan",
        profilePicture: getRandomPicsumUrl(),
        description: "Delicious homemade pizza!",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          city: await getCityFromCoordinates(40.7128, -74.0060)
        },
        likes: 200,
        comments: [commentIds[1]],
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "BeachBum",
        profilePicture: getRandomPicsumUrl(),
        description: "A day at the beach.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 36.7783,
          longitude: -119.4179,
          city: await getCityFromCoordinates(36.7783, -119.4179)
        },
        likes: 120,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "Hiker",
        profilePicture: getRandomPicsumUrl(),
        description: "Hiking adventure.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          city: await getCityFromCoordinates(34.0522, -118.2437)
        },
        likes: 95,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "CityDweller",
        profilePicture: getRandomPicsumUrl(),
        description: "City skyline at night.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 51.5074,
          longitude: -0.1278,
          city: await getCityFromCoordinates(51.5074, -0.1278)
        },
        likes: 180,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "SnowLover",
        profilePicture: getRandomPicsumUrl(),
        description: "Snowy mountains.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 46.6034,
          longitude: 1.8883,
          city: await getCityFromCoordinates(46.6034, 1.8883)
        },
        likes: 210,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "BreakfastLover",
        profilePicture: getRandomPicsumUrl(),
        description: "Delicious breakfast.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          city: await getCityFromCoordinates(48.8566, 2.3522)
        },
        likes: 130,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "ConcertGoer",
        profilePicture: getRandomPicsumUrl(),
        description: "Concert night.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 40.7306,
          longitude: -73.9352,
          city: await getCityFromCoordinates(40.7306, -73.9352)
        },
        likes: 175,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "ArtEnthusiast",
        profilePicture: getRandomPicsumUrl(),
        description: "Art gallery visit.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 35.6895,
          longitude: 139.6917,
          city: await getCityFromCoordinates(35.6895, 139.6917)
        },
        likes: 85,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "Camper",
        profilePicture: getRandomPicsumUrl(),
        description: "Camping under the stars.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          city: await getCityFromCoordinates(37.7749, -122.4194)
        },
        likes: 140,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "FestivalGoer",
        profilePicture: getRandomPicsumUrl(),
        description: "Street food festival.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 52.5200,
          longitude: 13.4050,
          city: await getCityFromCoordinates(52.5200, 13.4050)
        },
        likes: 160,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: new mongoose.Types.ObjectId(),
        nickname: "Yogi",
        profilePicture: getRandomPicsumUrl(),
        description: "Sunrise yoga session.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          city: await getCityFromCoordinates(34.0522, -118.2437)
        },
        likes: 110,
        comments: [], // No comments for this post
        createdAt: new Date(),
      }
    ];

    // Insert mockup post data into the database
    await Post.insertMany(mockupData);
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