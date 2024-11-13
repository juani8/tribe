const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const authRoutes = require('../routes/authRoutes');
const postRoutes = require('../routes/postRoutes');
const userRoutes = require('../routes/userRoutes');
const auth = require('../middlewares/auth');

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next(); 
});

app.use('/auths', authRoutes);
app.use('/posts', auth, postRoutes);
app.use('/users', auth, userRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
