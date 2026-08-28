import { useState } from "react";

const PostForm = ({ onPostCreated, tavernId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await onPostCreated({
        title,
        content,
        ...(tavernId && { tavern: tavernId }), // Adjunta el ID de la taberna si existe
      });
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error al crear post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#1e1e1e",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1.5rem",
        border: "1px solid #333",
      }}
    >
      <input
        type="text"
        placeholder="Título del post..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "0.5rem",
          backgroundColor: "#111",
          border: "1px solid #444",
          borderRadius: "4px",
          color: "#fff",
          boxSizing: "border-box",
        }}
      />
      <textarea
        placeholder="¿Qué aventura quieres compartir hoy?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "0.5rem",
          backgroundColor: "#111",
          border: "1px solid #444",
          borderRadius: "4px",
          color: "#fff",
          boxSizing: "border-box",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: "#f39c12",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
};

export default PostForm;