# Wireframes y Flujo de Navegación del MVP

## Estructura de Rutas Frontend (React Router)

- `/` — Feed principal global (muestra las publicaciones más recientes de todas las Tabernas).
- `/signup` — Formulario de registro de usuario.
- `/login` — Formulario de inicio de sesión.
- `/taverns` — Lista/explorador de todas las Tabernas creadas.
- `/taverns/new` — Formulario para crear una nueva Taberna.
- `/taverns/:tavernId` — Vista de una Taberna con su descripción, miembros y lista de publicaciones.
- `/taverns/:tavernId/posts/new` — Formulario para crear una publicación dentro de esa Taberna.
- `/posts/:postId` — Vista detallada de una publicación con sus votos, etiqueta y caja de comentarios.
- `/profile/:userId` — Perfil público del usuario con su avatar, bio, juegos favoritos y sus publicaciones.

## Descripción de Pantallas y Flujo - https://www.figma.com/design/Wyx9nfBDWdNEpswZ6fr544/Sin-t%C3%ADtulo?node-id=0-1&t=EvMmLD9rfbNORP3K-1 

1. **Pantalla Principal (`/`):**
   - _Datos:_ Lista de posts ordenados por fecha, barra lateral con Tabernas populares.
   - _Acciones:_ Filtrar posts por etiqueta (`LFG`, `Reglas`, etc.), ir al detalle del post, botón para crear post (redirige a login si no está autenticado).

2. **Pantalla Registro y Login (`/signup` y `/login`)**
  - _Datos:_ Formularios de registro y login de la web
  - _Acciones:_ Register , login > abrir session (cookie), etc.

3. **Explorador de Tabernas (`/taverns` y `/taverns/:tavernId`):**
   - _Datos:_ Nombre, banner/icono, descripción y número de publicaciones.
   - _Acciones:_ Botón "Crear Taberna", botón "Crear Publicación en esta Taberna".

4. **Detalle de Publicación (`/posts/:postId`):**
   - _Datos:_ Título, cuerpo, autor, etiqueta (badge), número de votos y lista de comentarios.
   - _Acciones:_ Votar (+1 dado), publicar un nuevo comentario, eliminar post (si es el autor).

5. **Perfil de Usuario (`/profile/:userId`):**
   - _Datos:_ Avatar, username, bio, lista de juegos preferidos y listado de sus posts creados.
