import { useState } from "react";

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [tavern, setTavern] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !tavern.trim()) return;

    try {
      await onPostCreated({ title, tavern, content });
      setTitle("");
      setTavern("");
      setContent("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al publicar");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: "2rem", textAlign: "left" }}
    >
      {error && <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>}

      <div style={{ marginBottom: "0.5rem" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del post..."
          style={{ width: "100%", padding: "0.5rem", borderRadius: "4px" }}
          required
        />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <input
          type="text"
          value={tavern}
          onChange={(e) => setTavern(e.target.value)}
          placeholder="ID o Nombre de la Taberna..."
          style={{ width: "100%", padding: "0.5rem", borderRadius: "4px" }}
          required
        />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué aventura quieres compartir hoy?"
          rows="3"
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "6px",
            resize: "vertical",
          }}
          required
        />
      </div>

      <button
        type="submit"
        style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        Publicar
      </button>
    </form>
  );
};

export default PostForm;
