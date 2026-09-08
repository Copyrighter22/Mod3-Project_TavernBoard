// seed.js
const dns = require("node:dns");
// Parche de resolución DNS para Node.js y MongoDB Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// 1. Configuración centralizada con Convict y Cloudinary
const config = require("./config/config"); // Ajusta la ruta a tu config.js si fuera necesario

cloudinary.config({
  cloud_name: config.get("cloudinary.cloudName"),
  api_key: config.get("cloudinary.apiKey"),
  api_secret: config.get("cloudinary.apiSecret"),
});

// Importa tus modelos de Mongoose
const User = require("./models/User");
const Tavern = require("./models/Tavern");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

const MONGO_URI = config.get("mongoUri");

// Helper para buscar la imagen local (.jpg, .png, .jfif, etc.) y subirla a Cloudinary
const uploadToCloudinary = async (prefix, fallbackUrl = "") => {
  let imagesDir = path.join(__dirname, "public", "images");
  if (!fs.existsSync(imagesDir)) {
    imagesDir = path.join(__dirname, "public", "uploads");
  }

  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    const match = files.find((file) => file.startsWith(`${prefix}.`));

    if (match) {
      const filePath = path.join(imagesDir, match);
      try {
        console.log(`📤 Subiendo ${match} a Cloudinary...`);
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "tavern_board",
        });
        return result.secure_url;
      } catch (err) {
        console.error(`❌ Error al subir ${match} a Cloudinary:`, err.message);
      }
    }
  }

  return fallbackUrl;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("⚡ Conectado a MongoDB con éxito...");

    // 2. Limpiar la base de datos
    await User.deleteMany({});
    await Tavern.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log("🧹 Base de datos limpiada.");

    // 3. Crear Contraseña Encriptada (12345678)
    const hashedPassword = await bcrypt.hash("12345678", 10);

    // 4. Subir Avatares de Usuarios a Cloudinary
    console.log("📸 Procesando imágenes de usuarios...");
    const defaultAvatar = config.get("defaults.userAvatar");
    const avatar1 = await uploadToCloudinary("avatar1", defaultAvatar);
    const avatar2 = await uploadToCloudinary("avatar2", defaultAvatar);
    const avatar3 = await uploadToCloudinary("avatar3", defaultAvatar);
    const avatar4 = await uploadToCloudinary("avatar4", defaultAvatar);
    const avatar5 = await uploadToCloudinary("avatar5", defaultAvatar);

    // Crear 5 Usuarios
    const usersData = [
      {
        username: "GandalfElGris",
        email: "gandalf@mordor.com",
        password: hashedPassword,
        bio: "Un mago nunca llega tarde, ni pronto. Llega exactamente cuando se lo propone.",
        avatar: avatar1,
      },
      {
        username: "ThorinEscudoDeRoble",
        email: "thorin@montana.com",
        password: hashedPassword,
        bio: "Buscando reconquistar Erebor. Pago bien en oro.",
        avatar: avatar2,
      },
      {
        username: "LegolasHojaVerde",
        email: "legolas@bosque.com",
        password: hashedPassword,
        bio: "Tirador experto. ¿Eso solo cuenta como uno?",
        avatar: avatar3,
      },
      {
        username: "ValeriaLaTabernera",
        email: "valeria@taberna.com",
        password: hashedPassword,
        bio: "La mejor hidromiel del reino. Si rompes una silla, la pagas.",
        avatar: avatar4,
      },
      {
        username: "SirGalahad",
        email: "galahad@caballeros.com",
        password: hashedPassword,
        bio: "En busca del Santo Grial y de una buena hogaza de pan.",
        avatar: avatar5,
      },
    ];

    const users = await User.insertMany(usersData);
    console.log("👤 5 Usuarios creados.");

    // 5. Subir Imágenes y Banners de Tabernas a Cloudinary
    console.log("🏰 Procesando imágenes de tabernas...");
    const defaultIcon = config.get("defaults.tavernIcon");
    const defaultBanner = config.get("defaults.tavernBanner");

    const t1Icon = await uploadToCloudinary("tavern1", defaultIcon);
    const t1Banner = await uploadToCloudinary("banner1", defaultBanner);
    const t2Icon = await uploadToCloudinary("tavern2", defaultIcon);
    const t2Banner = await uploadToCloudinary("banner2", defaultBanner);
    const t3Icon = await uploadToCloudinary("tavern3", defaultIcon);
    const t3Banner = await uploadToCloudinary("banner3", defaultBanner);
    const t4Icon = await uploadToCloudinary("tavern4", defaultIcon);
    const t4Banner = await uploadToCloudinary("banner4", defaultBanner);
    const t5Icon = await uploadToCloudinary("tavern5", defaultIcon);
    const t5Banner = await uploadToCloudinary("banner5", defaultBanner);

    // Crear 5 Tabernas
    const tavernsData = [
      {
        name: "El Dragon Tuerto",
        description:
          "Lugar oscuro y concurrido por mercenarios, cazadores de recompensas y magos renegados.",
        image: t1Icon,
        banner: t1Banner,
        owner: users[3]._id,
        members: [users[0]._id, users[1]._id, users[3]._id],
      },
      {
        name: "El Poni Pisador",
        description:
          "Acogedora taberna en la encrucijada de caminos. Famosa por su cerveza negra y música en vivo.",
        image: t2Icon,
        banner: t2Banner,
        owner: users[3]._id,
        members: [users[0]._id, users[2]._id, users[3]._id, users[4]._id],
      },
      {
        name: "El Yunque Encendido",
        description:
          "La preferida de los enanos. El ruido de los brindis compite con el del martillo.",
        image: t3Icon,
        banner: t3Banner,
        owner: users[1]._id,
        members: [users[1]._id, users[4]._id],
      },
      {
        name: "La Cerveza Saltarina",
        description:
          "Un refugio tranquilo junto al río donde los elfos y medianos comparten leyendas.",
        image: t4Icon,
        banner: t4Banner,
        owner: users[2]._id,
        members: [users[0]._id, users[2]._id],
      },
      {
        name: "El Cuervo Borracho",
        description:
          "Escondite para pícaros y contrabandistas. Habla bajo si quieres conservar la bolsa de oro.",
        image: t5Icon,
        banner: t5Banner,
        owner: users[3]._id,
        members: [users[1]._id, users[3]._id],
      },
    ];

    const taverns = await Tavern.insertMany(tavernsData);
    console.log("🍻 5 Tabernas creadas.");

    // 6. Subir Imágenes de Publicaciones a Cloudinary
    console.log("📝 Procesando imágenes de publicaciones...");
    const post1Img = await uploadToCloudinary("post1", "");
    const post2Img = await uploadToCloudinary("post2", "");

    // Crear 10 Publicaciones (Todas asignadas a una taberna existente)
    const postsData = [
      {
        title: "¡Aviso de búsqueda de grupo!",
        content:
          "Se busca guerrero y clérigo para incursión en las Minas Olvidadas este fin de semana.",
        author: users[0]._id,
        tavern: taverns[0]._id, // El Dragon Tuerto
        image: post1Img,
        upvotes: [users[1]._id, users[2]._id, users[3]._id],
      },
      {
        title: "Receta secreta de Hidromiel de Roble",
        content:
          "Lleva 3 meses de fermentación con miel de las montañas del norte y especias del desierto.",
        author: users[3]._id,
        tavern: taverns[1]._id, // El Poni Pisador
        upvotes: [users[0]._id, users[4]._id],
      },
      {
        title: "Se busca mi hacha perdida",
        content:
          "La olvidé ayer cerca de la chimenea después de la quinta jarra. Recompensa: 10 monedas de plata.",
        author: users[1]._id,
        tavern: taverns[2]._id, // El Yunque Encendido
        upvotes: [users[3]._id],
      },
      {
        title: "El atardecer sobre las colinas del sur",
        content:
          "Nada como una buena caminata antes de parar a descansar en la siguiente posada.",
        author: users[2]._id,
        tavern: taverns[3]._id, // La Cerveza Saltarina
        image: post2Img,
        upvotes: [users[0]._id, users[1]._id, users[4]._id],
      },
      {
        title: "¿Alguien ha visto al dragón rojo por el norte?",
        content:
          "Escuché rumores de que sobrevoló el valle anoche. Preparen sus escudos.",
        author: users[4]._id,
        tavern: taverns[0]._id, // El Dragon Tuerto
        upvotes: [users[0]._id],
      },
      {
        title: "Música en vivo este viernes",
        content:
          "Tendremos a los mejores bardos de la Comarca tocando el laúd hasta el amanecer.",
        author: users[3]._id,
        tavern: taverns[1]._id, // El Poni Pisador
        upvotes: [users[2]._id, users[4]._id],
      },
      {
        title: "Torneo de pulsos en El Yunque",
        content:
          "Este sábado a medianoche. Entrada: 1 moneda de oro. El ganador se lleva todo el bote.",
        author: users[1]._id,
        tavern: taverns[2]._id, // El Yunque Encendido
        upvotes: [users[0]._id, users[3]._id, users[4]._id],
      },
      {
        title: "Reflexiones de un anciano caminante",
        content:
          "No todo lo que es oro reluce, ni toda la gente errante está perdida.",
        author: users[0]._id,
        tavern: taverns[3]._id, // La Cerveza Saltarina
        upvotes: [users[2]._id],
      },
      {
        title: "Prohibida la entrada a orcos sin escolta",
        content:
          "Por orden de la casa, rogamos mantener la paz o los guardias intervendrán.",
        author: users[3]._id,
        tavern: taverns[4]._id, // El Cuervo Borracho
        upvotes: [],
      },
      {
        title: "¿Cuál es su poción favorita?",
        content:
          "A bordo de una aventura siempre llevo curación ligera y una de invisibilidad por si acaso.",
        author: users[4]._id,
        tavern: taverns[1]._id, // El Poni Pisador
        upvotes: [users[1]._id, users[2]._id],
      },
    ];

    const posts = await Post.insertMany(postsData);
    console.log("📝 10 Posts creados.");

    // 7. Crear Comentarios
    const commentsData = [
      {
        content: "¡Me uno al grupo! Llevo mi hacha y mi escudo.",
        author: users[1]._id,
        post: posts[0]._id,
      },
      {
        content: "Cuenta con mi arco.",
        author: users[2]._id,
        post: posts[0]._id,
      },
      {
        content: "Esa hidromiel es la mejor que he probado jamás.",
        author: users[4]._id,
        post: posts[1]._id,
      },
      {
        content: "Creo que la vi detrás de la barra, Thorin.",
        author: users[3]._id,
        post: posts[2]._id,
      },
      {
        content: "¡Cuidado en los caminos del norte!",
        author: users[0]._id,
        post: posts[4]._id,
      },
    ];

    const comments = await Comment.insertMany(commentsData);

    for (let comment of comments) {
      await Post.findByIdAndUpdate(comment.post, {
        $push: { comments: comment._id },
      });
    }

    console.log("💬 Comentarios vinculados.");
    console.log("🚀 ¡Semilla completada con éxito con Cloudinary!");

    process.exit();
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
    process.exit(1);
  }
};

seedDatabase();
