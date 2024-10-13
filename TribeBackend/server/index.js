require("dotenv").config();

const connection = require("./db");
const app = require("./app");

async function init() {
  try {
    await connection();
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1); // Finalizar el proceso si ocurre un error crítico
  }
}

// Iniciar la aplicación
init();