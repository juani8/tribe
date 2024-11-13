require("dotenv").config();
 
const connection = require("./db");
const app = require("./app");
 
async function init() {
  try {    
    await connection();
    const port = process.env.PORT || 8080;
    const host = process.env.HOST || 'http://localhost';
    
    if (process.env.HOST) {
      app.listen(() => {
        console.log(`Servidor escuchando en: ${host}`);
      });
    } else {
      app.listen(port, () => {
        console.log(`Servidor escuchando en: ${host}:${port}`);
      });
    }
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1);
  }
}
 
// Iniciar la aplicación
init();