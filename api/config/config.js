// -----------------------------------------------------------------------------
// @desc    Esquema de configuración centralizado y validado con Convict
// -----------------------------------------------------------------------------
require("dotenv").config();
const convict = require("convict");

const config = convict({
  // --- Entorno y Puerto ---
  env: {
    doc: "Entorno de ejecución de la aplicación.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },
  port: {
    doc: "Puerto de escucha del servidor Express.",
    format: "port",
    default: 5000,
    env: "PORT",
  },

  // --- Base de Datos y Autenticación ---
  mongoUri: {
    doc: "URI de conexión a la base de datos MongoDB.",
    format: String,
    default: "mongodb://127.0.0.1:27017/tavern_board",
    env: "MONGO_URI",
  },
  jwtSecret: {
    doc: "Clave secreta para la firma de JSON Web Tokens.",
    format: String,
    default: "secreto_por_defecto_desarrollo",
    env: "JWT_SECRET",
  },

  // --- Servicio de Almacenamiento de Imágenes (Cloudinary) ---
  cloudinary: {
    cloudName: {
      doc: "Cloud Name de Cloudinary",
      format: String,
      default: "",
      env: "CLOUDINARY_CLOUD_NAME",
    },
    apiKey: {
      doc: "API Key de Cloudinary",
      format: String,
      default: "",
      env: "CLOUDINARY_API_KEY",
    },
    apiSecret: {
      doc: "API Secret de Cloudinary",
      format: String,
      default: "",
      env: "CLOUDINARY_API_SECRET",
    },
  },

  // --- Recursos Multimedia por Defecto ---
  defaults: {
    tavernBanner: {
      doc: "URL de banner genérica por defecto",
      format: String,
      default:
        "https://images.unsplash.com/photo-1590845947376-2638caa89309?q=80&w=1000&auto=format&fit=crop",
      env: "DEFAULT_TAVERN_BANNER",
    },
    tavernIcon: {
      doc: "URL de icono genérico por defecto",
      format: String,
      default: "https://cdn-icons-png.flaticon.com/512/3673/3673092.png",
      env: "DEFAULT_TAVERN_ICON",
    },
    userAvatar: {
      doc: "URL de avatar genérico por defecto para usuarios",
      format: String,
      default: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      env: "DEFAULT_USER_AVATAR",
    },
  },
});

// Validar que las variables de entorno cumplan con las reglas definidas
config.validate({ allowed: "strict" });

module.exports = config;
