// 1. IMPORTACIÓN DE DEPENDENCIAS Y MÓDULOS
const express = require("express");
const cors = require("cors");
const dns = require("node:dns");
require("dotenv").config();

// Importación de módulos locales
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const tavernRoutes = require("./routes/tavernRoutes");
const postRoutes = require("./routes/postRoutes");

// 2. CONFIGURACIÓN DE RED Y DNS (Forzar el uso de servidores DNS públicos (Google y Cloudflare) para resolver consultas SRV de MongoDB Atlas)
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

// 3. INICIALIZACIÓN DE LA APLICACIÓN Y CONFIGURACIÓN DEL PUERTO
const app = express();
const PORT = process.env.PORT || 5000;

// 4. CONEXIÓN A LA BASE DE DATOS
connectDB();

// 5. MIDDLEWARES GLOBALES
app.use(cors()); // Habilita peticiones HTTP desde distintos orígenes
app.use(express.json()); // Parsea las peticiones con cuerpo JSON en req.body

// 6. ENRUTAMIENTO Y ENDPOINTS DE LA API
app.use("/api/auth", authRoutes); // Maneja registro y login (/api/auth/register, /api/auth/login)
app.use("/api/taverns", tavernRoutes); // Maneja lectura y creación de tabernas (/api/taverns)
app.use("/api/posts", postRoutes); // Maneja publicaciones por taberna (/api/posts)

// 7. RUTA DE VERIFICACIÓN (HEALTH CHECK)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor API funcionando correctamente" });
});

// 8. ENCENDIDO DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en el puerto ${PORT}`);
});
