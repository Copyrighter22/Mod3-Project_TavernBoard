const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const config = require("../config/config");

// -----------------------------------------------------------------------------
// Configuración de credenciales de Cloudinary mediante Convict
// -----------------------------------------------------------------------------
cloudinary.config({
  cloud_name: config.get("cloudinary.cloudName"),
  api_key: config.get("cloudinary.apiKey"),
  api_secret: config.get("cloudinary.apiSecret"),
  timeout: 60000,
});

// -----------------------------------------------------------------------------
// Configuración del almacenamiento en Cloudinary
// -----------------------------------------------------------------------------
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "tavern_board",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

// -----------------------------------------------------------------------------
// Middleware de subida de archivos con Multer
// -----------------------------------------------------------------------------
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
