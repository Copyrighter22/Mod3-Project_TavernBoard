# 🎲 Tabernas — Comunidad de Rol y Juegos de Mesa

> Plataforma web estilo foro/comunidad diseñada para conectar a jugadores de rol y juegos de mesa, organizar partidas (LFG), resolver dudas de reglas y compartir contenido _homebrew_.

![Estado](<https://img.shields.io/badge/Estado-En_Desarrollo_(WIP)-orange>)
![Backend](https://img.shields.io/badge/Backend-Node.js_%7C_Express-brightgreen)
![Base_de_Datos](https://img.shields.io/badge/Database-MongoDB_%7C_Mongoose-green)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)

---

## 🚀 Características Principales

- **🔐 Autenticación de Usuarios:** Registro e inicio de sesión seguro con JWT y contraseñas hasheadas (`bcrypt`).
- **🏰 Tabernas (Comunidades):** Explora o crea comunidades temáticas (_Rol_, _Juegos de Mesa_, _LFG_, etc.).
- **📜 Publicaciones (Posts):** Crea hilos con etiquetas dinámicas (`lfg_busco_grupo`, `duda_reglas`, `homebrew`, `resena`, `general`).
- **👍 Sistema de Upvotes:** Sistema de votación interactivo tipo _toggle_ para destacar el contenido relevante.
- **💬 Comentarios:** Discusión e interacción directa dentro de cada publicación.
- **👤 Perfil de Usuario:** Muestra avatar, biografía, juegos favoritos y lista de publicaciones creadas.

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Base de Datos:** MongoDB, Mongoose
- **Frontend:** React, React Router
- **Autenticación:** JSON Web Tokens (JWT)

---

## 📂 Documentación del Proyecto

Las especificaciones detalladas del diseño y arquitectura se encuentran en la raíz del repositorio:

| Archivo                            | Descripción                                                    |
| :--------------------------------- | :------------------------------------------------------------- |
| [`api-design.md`](./api-design.md) | Definición de esquemas Mongoose y endpoints de la API REST.    |
| [`wireframes.md`](./wireframes.md) | Estructura de rutas del Frontend y prompts para diseño visual. |

---

## ⚡ Inicio Rápido (Entorno Local)

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- Instancia local o remota de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```
