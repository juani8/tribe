require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const axios = require('axios');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const { getCityFromCoordinates } = require('./osmGeocoder');
const { faker } = require('@faker-js/faker');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const keywords = ['nature', 'animals', 'technology', 'cityscape', 'food', 'sports', 'travel', 'people', 'party', 'art'];

function getRandomKeyword() {
  const randomIndex = Math.floor(Math.random() * keywords.length);
  return keywords[randomIndex];
}

async function fetchPixabayData(baseUrl, params) {
  try {
    const response = await axios.get(baseUrl, { params });
    return response.data.hits;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const resetTime = error.response.headers['x-ratelimit-reset'];
      const waitTime = resetTime * 1000;
      console.warn(`Límite de solicitudes alcanzado. Esperando ${waitTime / 1000} segundos antes de reintentar.`);
      await sleep(waitTime);
      return fetchPixabayData(baseUrl, params); // Reintentar después de esperar
    } else {
      console.error('Error fetching media from Pixabay:', error);
      throw error;
    }
  }
}

async function getRandomPixabayUrl(type) {
  const apiKey = process.env.PIXABAY_KEY;
  const baseUrl = type === 'video' ? 'https://pixabay.com/api/videos/' : 'https://pixabay.com/api/';
  const query = getRandomKeyword();
  
  await sleep(600);
  const params = {
    key: apiKey,
    q: query,
    order: 'latest',
    per_page: 3
  };

  if (type === 'video') {
    params.video_type = 'film'; 
    params.max_width = 256;
    params.max_height = 144;
  }

  try {
    const hits = await fetchPixabayData(baseUrl, params);
    if (hits.length === 0) {
      throw new Error('No se encontraron resultados.');
    }

    const randomIndex = Math.floor(Math.random() * hits.length);
    return type === 'video' ? hits[randomIndex].videos.medium.url : hits[randomIndex].webformatURL;
  } catch (error) {
    return null;
  }
}

// Function to generate mockup users
async function generateMockupUsers() {
  const userData = [];
  const usedNickNames = new Set();
  const genders = ['masculino', 'femenino', 'no binario', 'otro', 'prefiero no decir'];

  for (let i = 1; i <= 20; i++) {
    let nickName;
    do {
      nickName = faker.internet.username();
    } while (usedNickNames.has(nickName));

    usedNickNames.add(nickName);

    const user = new User({
      name: faker.person.firstName(),
      lastName: faker.person.lastName(),
      nickName: nickName,
      email: faker.internet.email(),
      password: await bcrypt.hash('password123', 10),
      isVerified: true,
      profileImage: await getRandomPixabayUrl('image'),
      coverImage: await getRandomPixabayUrl('image'),
      description: faker.lorem.sentence(),
      gender: genders[Math.floor(Math.random() * genders.length)],
      numberOfFollowers: 0,
      numberOfFollowing: 0,
      numberOfComments: 0,
      numberOfPosts: 0,
      numberOfFavorites: 0
    });

    console.log(`Usuario generado: ${JSON.stringify(user)}`);
    userData.push(user);
  }
  return userData;
}

// Function to generate mockup posts
async function generateMockupPosts(users) {
  const postData = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const numberOfPosts = Math.floor(Math.random() * 5) + 1; // Each user has between 1 and 5 posts
    user.numberOfPosts += numberOfPosts; // Increment the number of posts for the user
    for (let j = 0; j < numberOfPosts; j++) {
      const numberOfMultimedia = Math.floor(Math.random() * 5) + 1; // Each post has between 1 and 5 multimedia items
      const multimedia = [];
      for (let k = 0; k < numberOfMultimedia; k++) {
        const type = Math.random() > 0.5 ? 'image' : 'video';
        multimedia.push({
          url: await getRandomPixabayUrl(type),
          type: type
        });
      }
      const post = new Post({
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

      console.log(`Post generado: ${JSON.stringify(post)}`);
      postData.push(post);
    }
    await user.save(); // Save the user after updating the number of posts
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
      user.numberOfComments++; // Increment the number of comments for the user
      const comment = new Comment({
        userId: user._id,
        postId: post._id,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Comentario generado: ${JSON.stringify(comment)}`);
      commentData.push(comment);
      post.totalComments++;
      post.lastComment = comment._id;
      await user.save(); // Save the user after updating the number of comments
    }
    await post.save(); // Save the post after updating the comments
  }

  try {
    await Comment.deleteMany({}); // Limpia la colección
    await Comment.insertMany(commentData); // Inserta los datos de mockup
    console.log('Datos de mockup insertados correctamente');
  } catch (error) {
    console.error('Error al insertar datos de mockup:', error);
  }

  return commentData;
}

// Function to generate mockup comments for test user
async function generateMockupCommentsForTestUser(testUser, posts) {
  const commentData = [];
  const numberOfComments = Math.floor(Math.random() * 5) + 1; // Test user makes between 1 and 5 comments
  for (let i = 0; i < numberOfComments; i++) {
    const post = posts[Math.floor(Math.random() * posts.length)];
    testUser.numberOfComments++; // Increment the number of comments for the test user
    const comment = new Comment({
      userId: testUser._id,
      postId: post._id,
      comment: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`Comentario generado por usuario de prueba: ${JSON.stringify(comment)}`);
    commentData.push(comment);
    post.totalComments++;
    post.lastComment = comment._id;
    await post.save(); // Save the post after updating the comments
  }
  await testUser.save(); // Save the test user after updating the number of comments

  try {
    await Comment.insertMany(commentData); // Inserta los datos de mockup
    console.log('Comentarios de prueba insertados correctamente');
  } catch (error) {
    console.error('Error al insertar comentarios de prueba:', error);
  }

  return commentData;
}

// Function to generate mockup comments for test user's posts
async function generateMockupCommentsForTestUserPosts(testUserPosts, users) {
  const commentData = [];
  for (let i = 0; i < testUserPosts.length; i++) {
    const post = testUserPosts[i];
    const numberOfComments = Math.floor(Math.random() * 5); // Each post has between 0 and 5 comments
    for (let j = 0; j < numberOfComments; j++) {
      const user = users[Math.floor(Math.random() * users.length)];
      user.numberOfComments++; // Increment the number of comments for the user
      const comment = new Comment({
        userId: user._id,
        postId: post._id,
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Comentario generado en post de usuario de prueba: ${JSON.stringify(comment)}`);
      commentData.push(comment);
      post.totalComments++;
      post.lastComment = comment._id;
      await user.save(); // Save the user after updating the number of comments
    }
    await post.save(); // Save the post after updating the comments
  }

  try {
    await Comment.insertMany(commentData); // Inserta los datos de mockup
    console.log('Comentarios en posts de prueba insertados correctamente');
  } catch (error) {
    console.error('Error al insertar comentarios en posts de prueba:', error);
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

// Function to create a test user for the frontend developer
async function createTestUser() {
  const testUser = new User({
    name: 'Juan Ignacio',
    lastName: 'Sosa',
    nickName: 'jsosa',
    email: 'juasosa@uade.edu.ar',
    password: await bcrypt.hash('1234', 10),
    isVerified: true,
    profileImage: await getRandomPixabayUrl('image'),
    coverImage: await getRandomPixabayUrl('image'),
    description: '¡Hola! Me dicen Juani y me gusta la música alternativa.',
    gender: 'masculino',
    gamificationLevel: 2,
    numberOfFollowers: 0,
    numberOfFollowing: 0,
    numberOfComments: 0,
    numberOfPosts: 0,
    numberOfFavorites: 0
  });

  await testUser.save();
  console.log(`Usuario de prueba creado: ${JSON.stringify(testUser)}`);
  return testUser;
}

// Function to establish bookmark relationships
async function establishBookmarkRelationships(user, posts) {
  const numberOfBookmarks = Math.floor(Math.random() * posts.length / 2); // User bookmarks up to half of the posts
  for (let i = 0; i < numberOfBookmarks; i++) {
    const postToBookmark = posts[Math.floor(Math.random() * posts.length)];
    const postOwner = await User.findById(postToBookmark.userId);

    // Ensure the user follows the owner of the post
    if (!user.following.includes(postOwner._id)) {
      user.following.push(postOwner._id);
      postOwner.followers.push(user._id);
      user.numberOfFollowing++;
      postOwner.numberOfFollowers++;
      await postOwner.save();
    }

    const bookmark = new Bookmark({
      userId: user._id,
      postId: postToBookmark._id
    });
    await bookmark.save();
    user.numberOfFavorites++;
    console.log(`Bookmark creado: ${JSON.stringify(bookmark)}`);
  }
  await user.save();
}

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    const uri = process.env.NODE_ENV === 'Production' 
      ? process.env.MONGODB_URI 
      : process.env.MONGODB_URI_LOCAL;

    console.log('MONGODB_URI:', uri);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 900000, // 15 minutes
      socketTimeoutMS: 900000, // 15 minutes
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
    console.log('Los datos de comentario de mockup se generaron correctamente');

    // Create test user
    const testUser = await createTestUser();
    console.log('Usuario de prueba creado correctamente');

    // Generate mockup posts for test user
    const testUserPosts = await generateMockupPosts([testUser]);
    const insertedTestUserPosts = await Post.insertMany(testUserPosts);
    console.log('Posts de prueba generados correctamente');

    // Generate mockup comments for test user
    const testUserComments = await generateMockupCommentsForTestUser(testUser, insertedPosts);
    console.log('Comentarios de prueba generados correctamente');

    // Generate mockup comments for test user's posts
    const testUserPostsComments = await generateMockupCommentsForTestUserPosts(insertedTestUserPosts, insertedUsers);
    console.log('Comentarios en posts de prueba generados correctamente');

    // Establish bookmark relationships for test user
    await establishBookmarkRelationships(testUser, insertedPosts);
    console.log('Relaciones de favoritos establecidas para el usuario de prueba');

    // Close the MongoDB connection
    await closeDatabaseConnection();
  } catch (error) {
    console.error('Error al generar datos de mockup:', error);
    process.exit(1);
  }
}

// Run the generateMockupData function
generateMockupData();