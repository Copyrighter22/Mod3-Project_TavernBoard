// -----------------------------------------------------------------------------
// COMPONENTE TARJETA DE TABERNA (TAVERN CARD)
// -----------------------------------------------------------------------------
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toggleJoinTavern } from "../../services/tavernService";

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1590845947376-2638caa89309?q=80&w=1000&auto=format&fit=crop";
const DEFAULT_ICON = "https://cdn-icons-png.flaticon.com/512/3673/3673092.png";

const TavernCard = ({ tavern, onTavernUpdated }) => {
  const { user } = useContext(AuthContext);
  const [joining, setJoining] = useState(false);

  // Comprobación de membresía asegurando comparación de cadenas
  const currentUserId = user?.id || user?._id;
  const isMember = tavern.members?.some((member) => {
    const memberId =
      typeof member === "object" ? member.id || member._id : member;
    return String(memberId) === String(currentUserId);
  });

  const handleJoinToggle = async () => {
    if (!user) return;
    setJoining(true);
    try {
      await toggleJoinTavern(tavern.id);
      if (onTavernUpdated) onTavernUpdated();
    } catch (err) {
      console.error("Error al cambiar estado de membresía:", err);
    } finally {
      setJoining(false);
    }
  };

  const bannerImg = tavern.banner || DEFAULT_BANNER;
  const iconImg = tavern.image || DEFAULT_ICON;

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden bg-white">
        {/* Banner e Icono */}
        <div style={{ position: "relative", height: "130px" }}>
          <img
            src={bannerImg}
            alt={`Banner de ${tavern.name}`}
            className="w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_BANNER;
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "-25px",
              left: "15px",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "3px solid #fff",
              backgroundColor: "#fff",
              overflow: "hidden",
              zIndex: 2,
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={iconImg}
              alt={`Icono de ${tavern.name}`}
              className="w-100 h-100 object-fit-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_ICON;
              }}
            />
          </div>
        </div>

        {/* Cuerpo */}
        <div
          className="card-body d-flex flex-column"
          style={{ paddingTop: "35px" }}
        >
          <h5
            className="card-title fw-bold mb-1 text-truncate"
            title={tavern.name}
          >
            {tavern.name}
          </h5>
          <p
            className="card-text small text-muted mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "38px",
            }}
          >
            {tavern.description}
          </p>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-light text-dark border">
              👥 {tavern.members?.length || 0} miembros
            </span>
          </div>

          <div className="d-flex gap-2 mt-auto pt-2">
            <Link
              to={`/taverns/${tavern.id}`}
              className="btn btn-outline-warning btn-sm flex-grow-1 text-dark fw-semibold"
            >
              Ver Taberna
            </Link>

            {user && (
              <button
                className={`btn btn-sm fw-semibold ${
                  isMember ? "btn-outline-danger" : "btn-warning text-dark"
                }`}
                onClick={handleJoinToggle}
                disabled={joining}
              >
                {joining ? "..." : isMember ? "Abandonar" : "Unirse"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavernCard;
