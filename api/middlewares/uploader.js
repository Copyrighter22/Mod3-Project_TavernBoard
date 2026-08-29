const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. Configuración de credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configuración del almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tavern_board", // Nombre de la carpeta que se creará en Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// 3. Crear middleware
const upload = multer({ storage });

module.exports = upload;
