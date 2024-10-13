const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  try {
    res.status(200).send({ message: 'Server is up and running!' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Algo salió mal' });
});

module.exports = app;