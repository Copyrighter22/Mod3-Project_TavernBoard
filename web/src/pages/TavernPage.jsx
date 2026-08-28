import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TavernCard from "../components/tavern_components/TavernCard";
import TavernForm from "../components/tavern_components/TavernForm";
import { getTaverns } from "../services/tavernService";

const TavernPage = () => {
  const [taverns, setTaverns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función de refresco manual para props (onTavernCreated / onTavernUpdated)
  const refreshTaverns = async () => {
    try {
      const data = await getTaverns();
      setTaverns(data);
    } catch (err) {
      console.error("Error al obtener las tabernas:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialTaverns = async () => {
      try {
        const data = await getTaverns();
        if (isMounted) setTaverns(data);
      } catch (err) {
        console.error("Error al obtener las tabernas:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialTaverns();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
        <h1 style={{ color: "#fff", marginBottom: "1.5rem" }}>🏰 Tabernas</h1>

        {/* Formulario para crear taberna */}
        <TavernForm onTavernCreated={refreshTaverns} />

        {/* Listado de tabernas */}
        {loading ? (
          <p style={{ color: "#fff" }}>Cargando tabernas...</p>
        ) : taverns.length === 0 ? (
          <p style={{ color: "#888" }}>
            Aún no hay tabernas creadas. ¡Crea la primera arriba!
          </p>
        ) : (
          taverns.map((tavern) => (
            <TavernCard
              key={tavern._id}
              tavern={tavern}
              onTavernUpdated={refreshTaverns}
            />
          ))
        )}
      </div>
    </>
  );
};

export default TavernPage;