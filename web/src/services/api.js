// -----------------------------------------------------------------------------
// CONFIGURACIÓN DE INSTANCIA AXIOS E INTERCEPTOR JWT
// -----------------------------------------------------------------------------
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
