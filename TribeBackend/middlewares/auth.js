const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para verificar y decodificar el token JWT proporcionado en el encabezado de autorización.
 * 
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función de middleware para pasar el control al siguiente middleware.
 */
const auth = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token, autorización denegada' });
  }

  // Verificar y decodificar el token JWT utilizando la clave privada almacenada en las variables de entorno
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Token invalido' });
    } else {
      // Almacenar el ID del usuario validado en la solicitud para su uso posterior
      req.user = decoded.user;
      next();
    }
  });
};

module.exports = auth;