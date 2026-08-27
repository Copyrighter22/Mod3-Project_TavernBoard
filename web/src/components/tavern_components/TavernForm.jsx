import { useState } from "react";

const TavernForm = ({ onTavernCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    try {
      await onTavernCreated({ name, description });
      setName("");
      setDescription("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la taberna");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: "2rem", textAlign: "left" }}
    >
      <h3 style={{ color: "#fff", marginBottom: "1rem" }}>
        Fundar una nueva Taberna
      </h3>

      {error && (
        <p style={{ color: "#ff4d4d", marginBottom: "0.5rem" }}>{error}</p>
      )}

      <div style={{ marginBottom: "0.5rem" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la Taberna..."
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "4px",
            border: "1px solid #444",
            backgroundColor: "#222",
            color: "#fff",
          }}
          required
        />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción de la taberna..."
          rows="3"
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "6px",
            resize: "vertical",
            border: "1px solid #444",
            backgroundColor: "#222",
            color: "#fff",
          }}
          required
        />
      </div>

      <button
        type="submit"
        style={{
          padding: "0.5rem 1.2rem",
          cursor: "pointer",
          backgroundColor: "#2ecc71",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Crear Taberna
      </button>
    </form>
  );
};

export default TavernForm;
