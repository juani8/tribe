require("dotenv").config();
 
const connection = require("./db");
const app = require("./app");
 
async function init() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error("La aplicación solo puede ejecutarse en el entorno de producción.");
    }
    
    await connection();
    const port = process.env.PORT || 8080;
    const host = process.env.HOST || 'http://localhost';
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