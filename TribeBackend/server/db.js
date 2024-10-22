// require('dotenv').config({ path: '../.env' });
// const { MongoClient, ServerApiVersion } = require('mongodb');
//
// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   console.error('MONGODB_URI no está definida en el archivo .env');
//   process.exit(1);
// }
//
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
//
// async function connection() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// }
//
// module.exports = connection;

require('dotenv').config(); // Ensure environment variables are loaded
const mongoose = require('mongoose');

// Replace with your actual MongoDB URI
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;