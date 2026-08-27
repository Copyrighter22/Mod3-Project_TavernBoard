import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import {
  getCommentsByPost,
  createComment,
  deleteComment,
} from "../../services/commentService.js";

const CommentSection = ({ postId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentsByPost(postId);
        setComments(data);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const newComment = await createComment(postId, content);
      setComments([newComment, ...comments]);
      setContent("");
    } catch (err) {
      console.error("Error al añadir comentario:", err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error al borrar comentario:", err);
    }
  };

  return (
    <div
      style={{
        marginTop: "1rem",
        paddingTop: "0.8rem",
        borderTop: "1px solid #333",
      }}
    >
      {user && (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
        >
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe un comentario..."
            style={{
              flex: 1,
              padding: "0.4rem 0.6rem",
              borderRadius: "4px",
              border: "1px solid #444",
              backgroundColor: "#222",
              color: "#fff",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.4rem 0.8rem",
              backgroundColor: "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Enviar
          </button>
        </form>
      )}

      {loading ? (
        <small style={{ color: "#888", display: "block" }}>
          Cargando comentarios...
        </small>
      ) : comments.length === 0 ? (
        <small style={{ color: "#888", display: "block" }}>
          Aún no hay comentarios.
        </small>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            style={{
              backgroundColor: "#151515",
              padding: "0.5rem 0.8rem",
              borderRadius: "4px",
              marginBottom: "0.5rem",
              display: "flex",
              justify: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ color: "#3498db", fontSize: "0.85rem" }}>
                @{comment.author?.username || comment.author?.name || "Usuario"}
              </strong>
              <span
                style={{
                  color: "#eee",
                  marginLeft: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                {comment.content}
              </span>
            </div>
            {user &&
              (comment.author?._id === user._id ||
                comment.author === user._id) && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#e74c3c",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ✕
                </button>
              )}
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
