// -----------------------------------------------------------------------------
// CONTEXTO DE AUTENTICACIÓN (AUTH CONTEXT & PROVIDER)
// -----------------------------------------------------------------------------
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const AuthContext = createContext();

// -----------------------------------------------------------------------------
// @desc    Función auxiliar para garantizar que la clave 'id' siempre esté presente
// -----------------------------------------------------------------------------
const normalizeUser = (userData) => {
  if (!userData) return null;
  return {
    ...userData,
    id: userData.id || userData._id,
  };
};

// -----------------------------------------------------------------------------
// @desc    Proveedor de estado global para la autenticación del usuario
// -----------------------------------------------------------------------------
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser || savedUser === "undefined") return null;
    try {
      const parsedUser = JSON.parse(savedUser);
      return normalizeUser(parsedUser);
    } catch {
      return null;
    }
  });

  // Guardar datos en localStorage y actualizar el estado normalizado
  const login = (userData, token) => {
    const normalizedUser = normalizeUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  // Limpiar sesión de usuario
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Actualizar datos del usuario actual garantizando el formato de 'id'
  const updateUser = (updatedData) => {
    const newUserData = normalizeUser({ ...user, ...updatedData });
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
