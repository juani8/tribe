require("dotenv").config();
 
const connection = require("./db");
const app = require("./app");
 
async function init() {
  try {    
    await connection();
    const host = 'http://tribe-redmedia.azurewebsites.net';
    
    app.listen(() => {
      console.log(`Servidor escuchando en: ${host}`);
    });
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1);
  }
}
 
// Iniciar la aplicación
init();