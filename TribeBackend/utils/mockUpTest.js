require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { getCityFromCoordinates } = require('./osmGeocoder');
const { faker } = require('@faker-js/faker');

// Verificar la disponibilidad de la variable de entorno
if (!process.env.MONGODB_URI_LOCAL) {
  console.error('Error: La variable MONGODB_URI_LOCAL no está definida en el archivo .env');
  process.exit(1);
}

// Function to get random Picsum URL
function getRandomPicsumUrl() {
  return `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;
}

// Function to generate mockup users
async function generateMockupUsers() {
  const userData = [];
  const usedNickNames = new Set();
  const genders = ['masculino', 'femenino', 'no binario', 'otro', 'prefiero no decir'];

  for (let i = 1; i <= 20; i++) {
    let nickName;
    do {
      nickName = faker.internet.userName();
    } while (usedNickNames.has(nickName));

    usedNickNames.add(nickName);

    userData.push({
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      nickName: nickName,
      email: faker.internet.email(),
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: getRandomPicsumUrl(),
      coverImage: getRandomPicsumUrl(),
      description: faker.lorem.sentence(),
      gender: genders[Math.floor(Math.random() * genders.length)],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfPosts: 0
    });
  }
  return userData;
}

// Function to generate mockup posts
async function generateMockupPosts(users) {
  const postData = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const numberOfPosts = Math.floor(Math.random() * 5) + 1; // Each user has between 1 and 5 posts
    user.numberOfPosts = numberOfPosts;
    for (let j = 0; j < numberOfPosts; j++) {
      const numberOfMultimedia = Math.floor(Math.random() * 5) + 1; // Each post has between 1 and 5 multimedia items
      const multimedia = [];
      for (let k = 0; k < numberOfMultimedia; k++) {
        multimedia.push({
          url: getRandomPicsumUrl(),
          type: 'image'
        });
      }
      postData.push({
        userId: user._id,
        description: faker.lorem.sentence(), // Generate random description using Faker
        multimedia: multimedia,
        location: {
          latitude: Math.random() * 180 - 90,
          longitude: Math.random() * 360 - 180,
          city: await getCityFromCoordinates(Math.random() * 180 - 90, Math.random() * 360 - 180)
        },
        likes: Math.floor(Math.random() * 100),
        lastComment: null,
        totalComments: 0,
        createdAt: new Date(),
      });
    }
  }
  return postData;
}

// Function to generate mockup comments
async function generateMockupComments(users, posts) {
  const commentData = [];
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const numberOfComments = Math.floor(Math.random() * 5); // Each post has between 0 and 5 comments
    for (let j = 0; j < numberOfComments; j++) {
      const user = users[Math.floor(Math.random() * users.length)];
      user.numberOfComments++;
      commentData.push({
        userId: user._id,
        postId: post._id,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
  return commentData;
}

// Function to establish follow relationships
async function establishFollowRelationships(users) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const numberOfFollows = Math.floor(Math.random() * users.length / 2); // Each user follows up to half of the other users
    for (let j = 0; j < numberOfFollows; j++) {
      const userToFollow = users[Math.floor(Math.random() * users.length)];
      if (user._id !== userToFollow._id && !user.following.includes(userToFollow._id)) {
        user.following.push(userToFollow._id);
        userToFollow.followers.push(user._id);
        user.numberOfFollowing++;
        userToFollow.numberOfFollowers++;
      }
    }
  }
  await Promise.all(users.map(user => user.save()));
}

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    console.log('MONGODB_URI_LOCAL:', process.env.MONGODB_URI_LOCAL);
    await mongoose.connect(process.env.MONGODB_URI_LOCAL, {
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

    // Establish follow relationships
    await establishFollowRelationships(insertedUsers);

    // Generate mockup posts
    const postData = await generateMockupPosts(insertedUsers);
    const insertedPosts = await Post.insertMany(postData);
    console.log('Los datos de post de mockup se insertaron correctamente');

    // Generate mockup comments
    const commentData = await generateMockupComments(insertedUsers, insertedPosts);
    await Comment.insertMany(commentData);
    console.log('Los datos de comentario de mockup se insertaron correctamente');

    // Close the MongoDB connection
    await closeDatabaseConnection();
  } catch (error) {
    console.error('Error al generar datos de mockup:', error);
    process.exit(1);
  }
}

// Run the generateMockupData function
generateMockupData();