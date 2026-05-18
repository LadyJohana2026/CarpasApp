require('dotenv').config();
const app        = require('./app');
const conectarDB = require('./database/conexion');

const PORT = process.env.PORT || 3001;

conectarDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 API disponible en http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  });
