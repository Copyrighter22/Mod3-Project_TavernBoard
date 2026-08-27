import { useState, useEffect } from "react";
import {
  getTaverns,
  createTavern,
  toggleJoinTavern,
} from "../services/tavernService";
import TavernForm from "../components/tavern_components/TavernForm";
import TavernCard from "../components/tavern_components/TavernCard";

const TavernsPage = () => {
  const [taverns, setTaverns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaverns = async () => {
      try {
        const data = await getTaverns();
        setTaverns(data);
      } catch (err) {
        console.error("Error al cargar tabernas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaverns();
  }, []);

  const handleCreateTavern = async (tavernData) => {
    const newTavern = await createTavern(tavernData);
    setTaverns([newTavern, ...taverns]);
  };

  const handleToggleJoin = async (tavernId) => {
    const updatedTavern = await toggleJoinTavern(tavernId);
    setTaverns(taverns.map((t) => (t._id === tavernId ? updatedTavern : t)));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h1 style={{ color: "#fff", textAlign: "left", marginBottom: "1.5rem" }}>
        Explorar Tabernas
      </h1>

      {/* Formulario para fundar nueva taberna */}
      <TavernForm onTavernCreated={handleCreateTavern} />

      <h2 style={{ color: "#fff", textAlign: "left", margin: "2rem 0 1rem 0" }}>
        Tabernas disponibles
      </h2>

      {loading ? (
        <p style={{ color: "#fff" }}>Cargando tabernas...</p>
      ) : taverns.length === 0 ? (
        <p style={{ color: "#888", textAlign: "left" }}>
          Aún no hay tabernas creadas.
        </p>
      ) : (
        taverns.map((tavern) => (
          <TavernCard
            key={tavern._id}
            tavern={tavern}
            onToggleJoin={handleToggleJoin}
          />
        ))
      )}
    </div>
  );
};

export default TavernsPage;
