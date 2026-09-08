const dns = require("node:dns");

// -----------------------------------------------------------------------------
// @desc    Ajuste global de DNS para resolver esquemas SRV de MongoDB Atlas y fuerza IPv4
// -----------------------------------------------------------------------------
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pinoHttp = require("pino-http");
const createError = require("http-errors");
const path = require("path");

// Configuración e Infraestructura
const config = require("./config/config");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const globalErrorHandler = require("./middlewares/errorMiddleware");

// Rutas de la aplicación
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tavernRoutes = require("./routes/tavernRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

// -----------------------------------------------------------------------------
// 1. Conexión a la Base de Datos
// -----------------------------------------------------------------------------
connectDB();

// -----------------------------------------------------------------------------
// 2. Middlewares Globales y de Seguridad
// -----------------------------------------------------------------------------
// Logger HTTP de peticiones con Pino
app.use(pinoHttp({ logger }));

// Configuración de CORS habilitado para transmisión de cookies/credenciales
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parsers de cuerpo de petición y cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -----------------------------------------------------------------------------
// 3. Montaje de Rutas de la API
// -----------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/taverns", tavernRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/search", searchRoutes);
app.use("/public", express.static(path.join(__dirname, "public")));

// -----------------------------------------------------------------------------
// 4. Manejo de Rutas No Encontradas (404)
// -----------------------------------------------------------------------------
app.use((req, res, next) => {
  next(
    createError(
      404,
      `No se encontró la ruta ${req.originalUrl} en este servidor`,
    ),
  );
});

// -----------------------------------------------------------------------------
// 5. Middleware Centralizado de Manejo de Errores (Siempre al final)
// -----------------------------------------------------------------------------
app.use(globalErrorHandler);

// -----------------------------------------------------------------------------
// 6. Arranque del Servidor
// -----------------------------------------------------------------------------
const PORT = config.get("port");
app.listen(PORT, () => {
  logger.info(
    `Servidor API ejecutándose en el puerto ${PORT} en entorno [${config.get("env")}]`,
  );
});
