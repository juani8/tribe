require("dotenv").config();

const connection = require("./db");
const app = require("./app");

async function init() {
  try {
    await connection();
    const port = 8080;
    const host = 'http://localhost';
    app.listen(port, () => {
      // Si el host de Azure esta definido, Azure establece automáticamente el puerto para la aplicación.
      if (process.env.HOST) {
        console.log(`Servidor escuchando en: ${host}`);
      } else {
        console.log(`Servidor escuchando en: ${host}:${port}`);
      }
    });
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1); 
  }
}    

// Iniciar la aplicación
init();