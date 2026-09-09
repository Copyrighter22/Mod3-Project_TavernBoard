# ==========================================
# ETAPA 1: Construir el Frontend (/web)
# ==========================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/web

# Copilar dependencias del frontend
COPY web/package*.json ./
RUN npm install

# Copiar el código fuente del frontend y compilar (Vite build)
COPY web/ ./
RUN npm run build


# ==========================================
# ETAPA 2: Configurar y ejecutar el Backend (/api)
# ==========================================
FROM node:22-alpine

WORKDIR /app/api

# Instalar dependencias de producción del backend
COPY api/package*.json ./
RUN npm ci --only=production

# Copiar el código fuente del backend
COPY api/ ./

# Copiar el resultado compilado del frontend (dist) a la carpeta public del backend
COPY --from=frontend-builder /app/web/dist ./public

# Exponer el puerto interno configurado en Fly.io (8080)
EXPOSE 8080

# Arrancar el servidor
CMD ["npm", "start"]