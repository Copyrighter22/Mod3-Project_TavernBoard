import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import { toggleJoinTavern } from "../../services/tavernService.js";

const TavernCard = ({ tavern, onTavernUpdated }) => {
  const { user } = useContext(AuthContext);

  // Comprobar si el usuario actual ya es miembro de la taberna
  const isMember =
    user &&
    tavern.members?.some((m) =>
      typeof m === "object" ? m._id === user._id : m === user._id,
    );

  const handleToggleJoin = async () => {
    try {
      await toggleJoinTavern(tavern._id);
      if (onTavernUpdated) onTavernUpdated();
    } catch (err) {
      console.error("Error al cambiar la pertenencia a la taberna:", err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "1.2rem",
        marginBottom: "1rem",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          justify: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to={`/taverns/${tavern._id}`}
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "#f39c12",
            textDecoration: "none",
          }}
        >
          🏰 {tavern.name}
        </Link>
        <span style={{ color: "#aaa", fontSize: "0.85rem" }}>
          👥 {tavern.members?.length || 0} miembros
        </span>
      </div>

      <p style={{ color: "#ccc", margin: "0.5rem 0 1rem 0" }}>
        {tavern.description}
      </p>

      {user && (
        <div>
          <button
            onClick={handleToggleJoin}
            style={{
              backgroundColor: isMember ? "#e74c3c" : "#2ecc71",
              color: "#fff",
              border: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isMember ? "Salir de la taberna" : "Unirse a la taberna"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TavernCard;
