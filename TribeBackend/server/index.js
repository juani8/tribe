require("dotenv").config();

const connection = require("./db");
const app = require("./app");

// Establecer conexión a la base de datos
connection();

/**
 * Función que inicializa la aplicación Express y la hace escuchar en un puerto específico.
 * Lee el puerto del entorno o utiliza el puerto 8080 por defecto.
 * 
 * @returns {Promise<void>} Retorna una promesa vacía.
 */
async function init() {
  // Obtener el puerto del entorno o usar 8080 como puerto por defecto
  const port = process.env.PORT || 8080;
  // Iniciar la aplicación Express y hacerla escuchar en el puerto especificado
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

// Iniciar la aplicación
init();