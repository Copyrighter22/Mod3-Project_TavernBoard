// -----------------------------------------------------------------------------
// CONFIGURACIÓN DE INSTANCIA AXIOS E INTERCEPTOR JWT (Versión v0)
// -----------------------------------------------------------------------------
import axios from "axios";

// Definimos la versión de la API explícitamente como v0
const API_VERSION = import.meta.env.VITE_API_VERSION || "v0";

// Si hay una URL base definida (ej: en local), la usa, si no, usa la ruta relativa con la versión
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/${API_VERSION}`
  : `/api/${API_VERSION}`;

const API = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Interceptor para inyectar automáticamente el token JWT en las cabeceras
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
