# Diseño de la API REST y Modelos de Datos

## Parte 1: Modelos de Datos (Mongoose)

### User

| Campo           | Tipo     | Validaciones     | Notas                                 |
| --------------- | -------- | ---------------- | ------------------------------------- |
| `username`      | String   | required, unique | Nombre público del jugador            |
| `email`         | String   | required, unique | Para login                            |
| `password`      | String   | required         | Hasheado con bcrypt                   |
| `avatar`        | String   | default          | URL de foto de perfil                 |
| `favoriteGames` | [String] | —                | Ej: ["D&D 5e", "Catan", "Gloomhaven"] |

javascript
const userSchema = new Schema(
{
username: { type: String, required: true, unique: true, trim: true },
email: { type: String, required: true, unique: true, lowercase: true, trim: true },
password: { type: String, required: true },
avatar: { type: String, default: "[https://avatar.iran.liara.run/public](https://avatar.iran.liara.run/public)" },
favoriteGames: [{ type: String }],

},
{ timestamps: true }
);

### Tavern(Comunidad)

| Campo         | Tipo     | Validaciones                                  | Notas                           |
| ------------- | -------- | --------------------------------------------- | ------------------------------- |
| `name`        | String   | "required, unique"                            | Ej: ""Dungeons & Dragons España |
| `description` | String   | "required"                                    | Propósito de la comunidad       |
| `category`    | String   | "enum: ['rol', 'boardgames', 'lfg', 'other']" | Categoría general               |
| `owner`       | ObjectId | "ref: 'User' required"                        | Creador de la taberna           |
| `members`     | ObjectId | "ref: 'User'"                                 | Miembros de la taberna          |

javascript
const tavernSchema = new Schema(
{
name: { type: String, required: true, unique: true, trim: true },
description: { type: String, required: true },
category: {
type: String,
enum: ['rol', 'boardgames', 'lfg', 'other'],
default: 'other'
},
owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
},
{ timestamps: true }
);

### Post

| Campo     | Tipo      | Validaciones                                                                | Notas                         |
| --------- | --------- | --------------------------------------------------------------------------- | ----------------------------- |
| `title`   | String    | required                                                                    | Título del hilo               |
| `body`    | String    | required                                                                    | Contenido del post            |
| `tag`     | String    | "enum: ['duda_reglas', 'lfg_busco_grupo', 'homebrew', 'resena', 'general']" | Etiqueta obligatoria          |
| `upvotes` | ObjectId  | ref: 'User'                                                                 | Lista de usuarios que votaron |
| `author`  | ObjectId  | "ref: 'User' required"                                                      | Creador del post              |
| `tavern`  | ObjectId, | "ref: 'Tavern'required"                                                     | Taberna donde se publica      |

javascript
const postSchema = new Schema(
{
title: { type: String, required: true, trim: true },
body: { type: String, required: true },
tag: {
type: String,
enum: ['duda_reglas', 'lfg_busco_grupo', 'homebrew', 'resena', 'general'],
required: true,
},
upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
tavern: { type: Schema.Types.ObjectId, ref: 'Tavern', required: true },
},
{ timestamps: true }
);

### Comment

| Campo    | Tipo                  | Validaciones | Notas                 |
| -------- | --------------------- | ------------ | --------------------- |
| `body`   | String                | required     | Texto del comentario  |
| `author` | ObjectId,"ref: 'User' | required"    | Quien comenta         |
| `post`   | ObjectId "ref: 'Post' | required"    | Post al que pertenece |

javacript
const commentSchema = new Schema(
{
body: { type: String, required: true },
author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
},
{ timestamps: true }
);

## Parte 2: Endpoints de la API

# Especificación de API REST - Plataforma Tabernas y Comunidades

## 1. Autenticación (`/api/auth`)

| Método     | Endpoint             | Descripción                                | Requiere Auth |
| :--------- | :------------------- | :----------------------------------------- | :-----------: |
| **`POST`** | `/api/auth/register` | Registro de nuevos usuarios.               |      No       |
| **`POST`** | `/api/auth/login`    | Inicio de sesión (devuelve JWT token).     |      No       |
| **`POST`** | `/api/auth/logout`   | Cierre de sesión e invalidación del token. |      Sí       |

---

## 2. Usuarios (`/api/usuarios`)

| Método       | Endpoint             | Descripción                                                   | Requiere Auth |
| :----------- | :------------------- | :------------------------------------------------------------ | :-----------: |
| **`GET`**    | `/api/usuarios`      | Listado general de usuarios (con paginación y filtros).       |  Sí (Admin)   |
| **`GET`**    | `/api/usuarios/{id}` | Obtener la información del perfil del usuario.                |      Sí       |
| **`PATCH`**  | `/api/usuarios/{id}` | **Modificación parcial** del perfil (ej. avatar, contraseña). |      Sí       |
| **`DELETE`** | `/api/usuarios/{id}` | Eliminar o desactivar la cuenta del usuario.                  |      Sí       |

---

## 3. Tabernas / Comunidades (`/api/taverns`)

| Método       | Endpoint                 | Descripción                                                 |  Requiere Auth   |
| :----------- | :----------------------- | :---------------------------------------------------------- | :--------------: |
| **`GET`**    | `/api/taverns`           | Obtener catálogo de taverns/comunidades públicas.           |        No        |
| **`GET`**    | `/api/taverns/{id}`      | Obtener detalle completo de una taberna específica.         |        No        |
| **`POST`**   | `/api/taverns`           | Crear una nueva taberna o comunidad.                        |        Sí        |
| **`POST`**   | `/api/taverns/{id}/join` | Unirse o salir de la taberna (Toggle automático)            |        Sí        |
| **`PATCH`**  | `/api/taverns/{id}`      | **Modificación parcial** (ej. aforo, horario, descripción). | Sí (Owner/Admin) |
| **`DELETE`** | `/api/taverns/{id}`      | Eliminar la taberna.                                        | Sí (Owner/Admin) |

---

## 4. Publicaciones y Anuncios (`/api/posts`)

| Método       | Endpoint                  | Descripción                                             |  Requiere Auth   |
| :----------- | :------------------------ | :------------------------------------------------------ | :--------------: |
| **`GET`**    | `/api/taverns/{id}/posts` | Listar posts dentro de una taberna.                     |        Sí        |
| **`GET`**    | `/api/posts/{id}`         | Detalle de una publicación y sus comentarios.           |        Sí        |
| **`POST`**   | `/api/taverns/{id}/posts` | Crear una nueva publicación.                            |        Sí        |
| **`POST`**   | `/api/posts/{id}/vote`    | Dar o quitar voto(Toggle)                               |        Sí        |
| **`PUT`**    | `/api/posts/{id}`         | **Reemplazo completo** del contenido de la publicación. | Sí (Autor/Admin) |
| **`PATCH`**  | `/api/posts/{id}`         | **Modificación parcial** (ej. editar texto o adjuntos). | Sí (Autor/Admin) |
| **`DELETE`** | `/api/posts/{id}`         | Eliminar la publicación.                                | Sí (Autor/Admin) |

---

## 5. Comentarios (`/api/comments` / `/api/posts/{id}/comments`)

| Método       | Endpoint                   | Descripción                           |  Requiere Auth   |
| :----------- | :------------------------- | :------------------------------------ | :--------------: |
| **`GET`**    | `/api/posts/{id}/comments` | Listar comentarios dentro de un post. |        No        |
| **`POST`**   | `/api/posts/{id}/comments` | Publicar un comentario.               |        Sí        |
| **`DELETE`** | `/api/comments/{id}`       | Eliminar un comentario.               | Sí (Autor/Admin) |

---
