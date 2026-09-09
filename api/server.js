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

// Configuración de CORS inteligente según el entorno
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman o llamadas internas del mismo servidor)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) === -1 &&
        config.get("env") === "production"
      ) {
        // En producción, si se sirve desde el mismo Fly.io, se permite el mismo origen
        return callback(null, true);
      }
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        config.get("env") !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("Bloqueado por la política de CORS"));
    },
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
// 3.1. Servir el Frontend compilado (Vite) en Producción
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// Catch-all para React Router (SPA) usando regex compatible para evitar PathError
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -----------------------------------------------------------------------------
// 4. Manejo de Rutas No Encontradas (404 para API)
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
// 6. Arranque del Servidor y Timouts aumentados para subida de imágenes
// -----------------------------------------------------------------------------
const PORT = config.get("port");
const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info(
    `Servidor API ejecutándose en el puerto ${PORT} en entorno [${config.get("env")}]`,
  );
});

// Ampliar el timeout del servidor a 2 minutos para evitar cortes con Cloudinary
server.timeout = 120000;
server.keepAliveTimeout = 120000;
