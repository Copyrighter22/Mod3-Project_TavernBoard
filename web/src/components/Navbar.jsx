import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.js";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justify: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#242424",
        color: "#fff",
        marginBottom: "2rem",
        width: "100%",
        boxSizing: "border-box",
        gap: "2rem",
      }}
    >
      {/* Sección Izquierda: Enlaces */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link
          to="/"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          🏰 Tavern Board
        </Link>
        <Link
          to="/taverns"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "1rem",
          }}
        >
          Tabernas
        </Link>
        <Link
          to="/profile"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontWeight: "500",
            fontSize: "1rem",
          }}
        >
          Mi Perfil
        </Link>
      </div>

      {/* Sección Derecha: Usuario / Sesión */}
      <div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ whiteSpace: "nowrap" }}>
              Hola, <strong>{user.username || user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.4rem 0.8rem",
                cursor: "pointer",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#e74c3c",
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;