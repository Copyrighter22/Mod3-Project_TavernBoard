// -----------------------------------------------------------------------------
// COMPONENTE TARJETA DE PUBLICACIÓN (POST CARD)
// -----------------------------------------------------------------------------
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import API from "../../services/api";

export default function PostCard({
  post,
  onLikeSuccess,
  onDelete,
  showAllComments = false,
}) {
  const { user } = useContext(AuthContext);
  const authorId = post.author?.id || post.author?._id;
  const navigate = useNavigate();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [commentsPreview, setCommentsPreview] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);

  const postId = post.id || post._id;
  const isOwner =
    user &&
    String(post.author?.id || post.author?._id) === String(user.id || user._id);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/comments/post/${postId}`);
        setCommentsCount(res.data.length);
        if (!showAllComments) {
          setCommentsPreview(res.data.slice(0, 2));
        }
      } catch (err) {
        console.error("Error al obtener preview de comentarios", err);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, showAllComments]);

  const handleNextImg = () => {
    if (post.images?.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const handlePrevImg = () => {
    if (post.images?.length > 1) {
      setCurrentImgIndex((prev) =>
        prev === 0 ? post.images.length - 1 : prev - 1,
      );
    }
  };

  const handleUpvote = async () => {
    try {
      const res = await API.put(`/posts/${postId}/upvote`);
      if (onLikeSuccess) onLikeSuccess(res.data);
    } catch (err) {
      console.error("Error al reaccionar", err);
    }
  };

  const handleDeletePostConfirm = () => {
    Swal.fire({
      title: "¿Borrar publicación?",
      text: "Esta historia se perderá en el olvido para siempre.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#fcf8f2",
      color: "#212529",
      customClass: {
        popup: "rounded-4 shadow-lg border",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/posts/${postId}`);
          if (onDelete) onDelete(postId);
          Swal.fire({
            title: "¡Eliminado!",
            text: "La publicación ha sido borrada.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: "#fcf8f2",
          });
        } catch (err) {
          console.error("Error al eliminar la publicación:", err);
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la publicación.",
            icon: "error",
            background: "#fcf8f2",
          });
        }
      }
    });
  };

  const tavernId = post.tavern?.id || post.tavern?._id;

  return (
    <div
      className="card mb-4 border-0 shadow-sm rounded-3 p-3"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
    >
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Link
          to={`/users/${authorId}`}
          className="text-decoration-none d-flex align-items-center gap-2"
        >
          <img
            src={
              post.author?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.author?.username || "Aventurero",
              )}&background=dfd0b7&color=78350f`
            }
            alt="avatar"
            className="rounded-circle object-fit-cover"
            width="36"
            height="36"
          />
          <span className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
            {post.author?.username || post.author?.name || "Aventurero"}
          </span>
        </Link>

        {isOwner && onDelete && (
          <button
            onClick={handleDeletePostConfirm}
            className="btn btn-sm text-danger p-0 border-0"
            title="Borrar publicación"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Título */}
      <h5 className="fw-bold mb-1 mt-1 text-dark">{post.title}</h5>

      {/* Etiqueta de la Taberna (#b55705) */}
      {post.tavern && (
        <div className="mb-2">
          <Link to={`/taverns/${tavernId}`} className="text-decoration-none">
            <span
              className="badge rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1 shadow-sm"
              style={{
                backgroundColor: "#b55705",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontSize: "0.75rem",
                letterSpacing: "0.3px",
              }}
            >
              <span>⚜️</span>
              <span>{post.tavern.name || "Global"}</span>
            </span>
          </Link>
        </div>
      )}

      {/* Contenido */}
      <p className="mb-3 text-secondary" style={{ fontSize: "0.95rem" }}>
        {post.content}
      </p>

      {/* Carrusel de Imágenes */}
      {post.images && post.images.length > 0 && (
        <div
          className="position-relative overflow-hidden rounded bg-black d-flex align-items-center justify-content-center mb-3"
          style={{ maxHeight: "420px" }}
        >
          <img
            src={post.images[currentImgIndex]}
            alt="Post media"
            className="w-100 object-fit-contain"
            style={{ maxHeight: "420px" }}
          />

          {post.images.length > 1 && (
            <>
              {currentImgIndex > 0 && (
                <button
                  onClick={handlePrevImg}
                  className="btn btn-dark btn-sm rounded-circle position-absolute start-0 ms-2 opacity-75"
                >
                  ‹
                </button>
              )}
              {currentImgIndex < post.images.length - 1 && (
                <button
                  onClick={handleNextImg}
                  className="btn btn-dark btn-sm rounded-circle position-absolute end-0 me-2 opacity-75"
                >
                  ›
                </button>
              )}
              <span className="badge bg-dark position-absolute top-0 end-0 m-2 opacity-75">
                {currentImgIndex + 1}/{post.images.length}
              </span>
            </>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div className="d-flex gap-2 align-items-center mt-1">
        <button
          onClick={handleUpvote}
          className="btn btn-sm d-flex align-items-center gap-2 px-3 text-white fw-bold rounded-2 border-0"
          style={{ backgroundColor: "#e63946" }}
        >
          <span style={{ fontSize: "1rem" }}>♥</span>
          <span>{post.upvotes?.length || 0}</span>
        </button>

        <button
          onClick={() => navigate(`/posts/${postId}`)}
          className="btn btn-sm d-flex align-items-center gap-2 px-3 rounded-2 text-dark bg-transparent"
          style={{ border: "1px solid #707780" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chat-square-text opacity-75"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
          </svg>
          <span>Comentarios ({commentsCount})</span>
        </button>
      </div>

      {/* Vista previa de comentarios */}
      {!showAllComments && commentsPreview.length > 0 && (
        <div className="mt-3 pt-2 border-top d-flex flex-column gap-2">
          {commentsPreview.map((c) => (
            <div
              key={c.id || c._id}
              className="p-2 rounded border w-100 shadow-sm"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderColor: "#ccc",
              }}
            >
              <span className="small text-truncate d-block">
                <strong className="text-dark me-1">
                  @{c.author?.username || c.author?.name || "Usuario"}:
                </strong>
                <span className="text-secondary">{c.content}</span>
              </span>
            </div>
          ))}

          {commentsCount > 2 && (
            <Link
              to={`/posts/${postId}`}
              className="small fw-bold text-dark text-decoration-underline d-block mt-1"
            >
              Ver los {commentsCount} comentarios...
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
