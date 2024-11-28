require("dotenv").config();

const connection = require("./db");
const app = require("./app");

async function init() {
  try {    
    await connection();
    const port = process.env.PORT || 8080;
    const host = process.env.NODE_ENV === 'Production' 
      ? process.env.HOST 
      : `http://localhost:${port}`;
    
    app.listen(port, () => {
      console.log(`Servidor escuchando en: ${host}`);
    });
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1);
  }
}

init();