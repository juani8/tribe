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
      name: 'John',
      lastName: 'Doe',
      nickName: 'SunsetLover',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: 'Lover of sunsets and nature.',
      gamificationLevel: 'Beginner',
      following: [],
      followers: [],
      favorites: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
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
      gamificationLevel: 'Intermediate',
      following: [],
      followers: [],
      favorites: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
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
      gamificationLevel: 'Advanced',
      following: [],
      followers: [],
      favorites: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
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
      favorites: [],
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
      gamificationLevel: 'Intermediate',
      following: [],
      followers: [],
      favorites: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
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
      gamificationLevel: 'Beginner',
      following: [],
      followers: [],
      favorites: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
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
      gamificationLevel: 'Advanced',
      following: [],
      followers: [],
      favorites: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
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
      gamificationLevel: 'Intermediate',
      following: [],
      followers: [],
      favorites: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
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
      gamificationLevel: 'Expert',
      following: [],
      followers: [],
      favorites: [],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfFavorites: 0,
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
      gamificationLevel: 'Advanced',
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

  // Mockup comment data
  const commentData = [
    {
      userId: users[0]._id,
      postId: new mongoose.Types.ObjectId(),
      comment: "Stunning view!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[1]._id,
      postId: new mongoose.Types.ObjectId(),
      comment: "Looks yummy!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[2]._id,
      postId: new mongoose.Types.ObjectId(),
      comment: "Amazing experience!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[3]._id,
      postId: new mongoose.Types.ObjectId(),
      comment: "Great review!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[4]._id,
      postId: new mongoose.Types.ObjectId(),
      comment: "Inspiring workout!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[5]._id,
      postId: new mongoose.Types.ObjectId(),
      comment: "Loved the book recommendations!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[6]._id,
      postId: new mongoose.Types.ObjectId(),
      comment: "Beautiful travel photos!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: users[7]._id,
      postId: new mongoose.Types.ObjectId(),
      comment: "Fantastic concert!",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 900000, // 30 seconds
      socketTimeoutMS: 900000, // 30 seconds
    });
    console.log('Connected to MongoDB');

    // Insert mockup comment data into the database
    const insertedComments = await Comment.insertMany(commentData);
    console.log('Mockup comment data inserted successfully');

    // Extract the ObjectIds of the inserted comments
    const commentIds = insertedComments.map(comment => comment._id);
 
    // Mockup post data
    const postData = [
      {
        userId: users[0]._id,
        nickname: users[0].nickName,
        profilePicture: users[0].profileImage,
        description: "A beautiful sunset over the mountains.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl(), getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: -34.6037,
          longitude: -58.3816,
          city: await getCityFromCoordinates(-34.6037, -58.3816)
        },
        likes: 150,
        comments: [commentIds[0], commentIds[1]], // Reference the ObjectIds of the inserted comments
        createdAt: new Date(),
      },
      {
        userId: users[1]._id,
        nickname: users[1].nickName,
        profilePicture: users[1].profileImage,
        description: "Delicious homemade pizza!",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          city: await getCityFromCoordinates(40.7128, -74.0060)
        },
        likes: 200,
        comments: [commentIds[2], commentIds[3]], // Reference the ObjectIds of the inserted comments
        createdAt: new Date(),
      },
      {
        userId: users[2]._id,
        nickname: users[2].nickName,
        profilePicture: users[2].profileImage,
        description: "Exploring the wild forest.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 36.7783,
          longitude: -119.4179,
          city: await getCityFromCoordinates(36.7783, -119.4179)
        },
        likes: 120,
        comments: [commentIds[4], commentIds[5]], // Reference the ObjectIds of the inserted comments
        createdAt: new Date(),
      },
      {
        userId: users[3]._id,
        nickname: users[3].nickName,
        profilePicture: users[3].profileImage,
        description: "Latest tech gadgets review.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          city: await getCityFromCoordinates(34.0522, -118.2437)
        },
        likes: 95,
        comments: [commentIds[6], commentIds[7]], // Reference the ObjectIds of the inserted comments
        createdAt: new Date(),
      },
      {
        userId: users[4]._id,
        nickname: users[4].nickName,
        profilePicture: users[4].profileImage,
        description: "Morning workout routine.",
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
        userId: users[5]._id,
        nickname: users[5].nickName,
        profilePicture: users[5].profileImage,
        description: "Top 10 books to read this year.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          city: await getCityFromCoordinates(48.8566, 2.3522)
        },
        likes: 210,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: users[6]._id,
        nickname: users[6].nickName,
        profilePicture: users[6].profileImage,
        description: "Traveling to the Alps.",
        multimedia: [getRandomPicsumUrl(), getRandomPicsumUrl()],
        location: {
          latitude: 46.6034,
          longitude: 1.8883,
          city: await getCityFromCoordinates(46.6034, 1.8883)
        },
        likes: 130,
        comments: [], // No comments for this post
        createdAt: new Date(),
      },
      {
        userId: users[7]._id,
        nickname: users[7].nickName,
        profilePicture: users[7].profileImage,
        description: "Live concert experience.",
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
        userId: users[8]._id,
        nickname: users[8].nickName,
        profilePicture: users[8].profileImage,
        description: "Visiting the art gallery.",
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
        userId: users[9]._id,
        nickname: users[9].nickName,
        profilePicture: users[9].profileImage,
        description: "Cooking masterclass.",
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