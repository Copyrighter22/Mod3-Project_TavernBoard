// -----------------------------------------------------------------------------
// PÁGINA EXPLORADORA DE TABERNAS DEL REINO
// -----------------------------------------------------------------------------
import { useState, useEffect, useCallback } from "react";
import TavernCard from "../components/tavern_components/TavernCard";
import Loader from "../components/Loader";
import { getAllTaverns } from "../services/tavernService";

const TavernsPage = () => {
  const [taverns, setTaverns] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshTaverns = useCallback(async () => {
    try {
      const data = await getAllTaverns();
      setTaverns(data);
    } catch (err) {
      console.error("Error al refrescar tabernas:", err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      const MIN_LOADING_TIME = 1500;
      const timer = new Promise((resolve) =>
        setTimeout(resolve, MIN_LOADING_TIME),
      );

      try {
        const [data] = await Promise.all([getAllTaverns(), timer]);

        if (isMounted) {
          setTaverns(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error al cargar tabernas:", err);
        await timer;
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Loader message="Explorando los mapas del reino en busca de tabernas..." />
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: "80%" }}>
      <div
        className="card border-0 rounded-4 shadow-sm mb-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #4d3826 0%, #614833 50%, #3b2a1c 100%)",
          border: "1px solid rgba(212, 175, 55, 0.4)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        }}
      >
        <div className="card-body p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
          <div>
            <span
              className="badge mb-2 px-3 py-2 rounded-pill fw-bold"
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.2)",
                color: "#ffd700",
                border: "1px solid rgba(212, 175, 55, 0.4)",
              }}
            >
              ⚜️ Puntos de Encuentro
            </span>
            <h1
              className="fw-bold display-6 mb-2"
              style={{ color: "#ffd700", fontFamily: "Georgia, serif" }}
            >
              Tabernas del Reino
            </h1>
            <p
              className="mb-0 text-light opacity-75"
              style={{ maxWidth: "580px" }}
            >
              Refugios para caballeros, juglares y aventureros. Toma asiento en
              un salón existente, entabla alianzas o comparte tus mejores
              historias.
            </p>
          </div>

          <div
            className="d-flex align-items-center p-3 rounded-3"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <div className="text-center px-3">
              <span
                className="h3 fw-bold d-block mb-0"
                style={{ color: "#ffd700" }}
              >
                {taverns.length}
              </span>
              <small
                className="text-light opacity-75 text-uppercase fw-semibold"
                style={{ fontSize: "0.7rem" }}
              >
                Tabernas
              </small>
            </div>
          </div>
        </div>
      </div>

      {taverns.length === 0 ? (
        <div className="card border-0 p-5 text-center shadow-sm rounded-3">
          <h5>No se han encontrado tabernas aún.</h5>
          <p className="text-muted">¡Fundador, sé el primero en abrir una!</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {taverns.map((tavern) => (
            <TavernCard
              key={tavern.id}
              tavern={tavern}
              onTavernUpdated={refreshTaverns}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TavernsPage;
