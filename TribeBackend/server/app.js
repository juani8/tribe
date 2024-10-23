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
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auths', authRoutes);
app.use('/users', auth, userRoutes);

app.get('/', (req, res) => {
  try {
    res.status(200).send({ message: 'El servidor está funcionando correctamente.' });
  } catch (error) {
    res.status(500).send({ message: 'Error interno del servidor' });
  }
});

app.use((err, req, res, next) => {
  console.error("Error detectado:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({ message: err.message || 'Ocurrió un error inesperado.' });
});

module.exports = app;