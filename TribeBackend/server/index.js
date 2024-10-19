require("dotenv").config();

const connection = require("./db");
const app = require("./app");

async function init() {
  try {
    await connection();
    const port = process.env.PORT || 8080;
    const host = process.env.HOST || 'http://localhost';
    app.listen(port, () => {
      console.log(`Servidor escuchando en: ${host}:${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1); // Finalizar el proceso si ocurre un error crítico
  }
}

// Iniciar la aplicación
init();