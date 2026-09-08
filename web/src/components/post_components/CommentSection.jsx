// -----------------------------------------------------------------------------
// COMPONENTE SECCIÓN DE COMENTARIOS DE UNA PUBLICACIÓN
// -----------------------------------------------------------------------------
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import API from "../../services/api";

const CommentSection = ({ postId, onCommentChange }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/comments/post/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await API.post(`/comments/post/${postId}`, { content });
      const updated = [res.data, ...comments];
      setComments(updated);
      setContent("");
      if (onCommentChange) onCommentChange(updated.length);
    } catch (err) {
      console.error("Error al publicar comentario:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (commentId) => {
    Swal.fire({
      title: "¿Eliminar comentario?",
      text: "Se borrará tu respuesta del tablón.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      background: "#fcf8f2",
      color: "#212529",
      customClass: {
        popup: "rounded-4 shadow-lg border",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/comments/${commentId}`);
          const updated = comments.filter(
            (c) => c.id !== commentId && c._id !== commentId,
          );
          setComments(updated);
          if (onCommentChange) onCommentChange(updated.length);

          Swal.fire({
            title: "Borrado",
            text: "El comentario ha sido eliminado.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: "#fcf8f2",
          });
        } catch (err) {
          console.error("Error al borrar comentario:", err);
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el comentario.",
            icon: "error",
            background: "#fcf8f2",
          });
        }
      }
    });
  };

  return (
    <div className="mt-3 pt-3 border-top">
      <h6 className="fw-bold mb-3 text-dark">
        💬 Comentarios ({comments.length})
      </h6>

      {user ? (
        <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Escribe un comentario en la taberna..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-warning btn-sm text-dark fw-bold px-3"
            disabled={submitting || !content.trim()}
          >
            {submitting ? "..." : "Comentar"}
          </button>
        </form>
      ) : (
        <div className="alert alert-light border small text-muted py-2 mb-3">
          <Link to="/login" className="fw-bold text-dark">
            Inicia sesión
          </Link>{" "}
          para participar en la conversación.
        </div>
      )}

      {loading ? (
        <div className="text-center py-2 text-muted small">
          Cargando comentarios...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-muted small italic py-2">
          Aún no hay comentarios en esta publicación. ¡Sé el primero en hablar!
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {comments.map((comment) => {
            const commentAuthorId = comment.author?.id || comment.author?._id;
            const authorName =
              comment.author?.username || comment.author?.name || "Aventurero";
            const isOwner =
              user && String(commentAuthorId) === String(user.id || user._id);

            const avatarUrl =
              comment.author?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                authorName,
              )}&background=dfd0b7&color=78350f`;

            return (
              <div
                key={comment.id || comment._id}
                className="py-2 px-3 rounded border w-100 shadow-sm d-flex justify-content-between align-items-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  borderColor: "#e0e0e0",
                }}
              >
                <div className="d-flex gap-2 align-items-center overflow-hidden me-2">
                  <img
                    src={avatarUrl}
                    alt={authorName}
                    className="rounded-circle object-fit-cover flex-shrink-0"
                    width="28"
                    height="28"
                  />
                  <div className="text-truncate">
                    <Link
                      to={`/profile/${commentAuthorId}`}
                      className="fw-bold text-decoration-none text-dark small me-1"
                    >
                      @{authorName}:
                    </Link>
                    <span className="small text-secondary">
                      {comment.content}
                    </span>
                  </div>
                </div>

                {isOwner && (
                  <button
                    onClick={() => handleDelete(comment.id || comment._id)}
                    className="btn btn-sm btn-outline-danger border-0 rounded-circle ms-2 flex-shrink-0 d-flex align-items-center justify-content-center opacity-75"
                    style={{ width: "26px", height: "26px", padding: 0 }}
                    title="Eliminar comentario"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
