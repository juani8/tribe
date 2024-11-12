const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const auth = require('../middlewares/auth');

const app = express();

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware
});

// Middleware
app.use(cors({
  origin: 'https://triberedmedia.netlify.app', // Replace with your Netlify URL
  methods: ['PATCH', 'POST'], // Allow these methods
}));
app.use(express.json());

// Rutas
app.use('/auths', authRoutes);
app.use('/users', auth, userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;