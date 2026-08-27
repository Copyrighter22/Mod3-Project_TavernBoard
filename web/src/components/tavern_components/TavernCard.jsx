import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { Link } from "react-router-dom";

const TavernCard = ({ tavern, onToggleJoin }) => {
  const { user } = useContext(AuthContext);

  const isMember =
    user &&
    tavern.members?.some((member) => (member._id || member) === user._id);

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0" }}>
          <Link
            to={`/taverns/${tavern._id}`}
            style={{ color: "#f39c12", textDecoration: "none" }}
          >
            {tavern.name}
          </Link>
        </h3>
        <small style={{ color: "#888" }}>
          Miembros: {tavern.members?.length || 0}
        </small>
      </div>

      <p style={{ margin: "0.5rem 0 1rem 0", color: "#e0e0e0" }}>
        {tavern.description}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <small style={{ color: "#888" }}>
          Líder:{" "}
          <strong style={{ color: "#3498db" }}>
            @{tavern.owner?.username || tavern.owner?.name || "Tabernero"}
          </strong>
        </small>

        {user && (
          <button
            onClick={() => onToggleJoin(tavern._id)}
            style={{
              backgroundColor: isMember ? "#e74c3c" : "#3498db",
              color: "#fff",
              border: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {isMember ? "Salir" : "Unirse"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TavernCard;
