// -----------------------------------------------------------------------------
// PÁGINA DE DETALLE DE OTRO AVENTURERO / USUARIO
// -----------------------------------------------------------------------------
import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import Loader from "../components/Loader";

export default function UserDetailPage() {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    user: null,
    posts: [],
    taverns: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const isOwnProfile = !id || id === currentUser?._id;

  useEffect(() => {
    let ignore = false;

    const fetchProfileData = async () => {
      try {
        const endpoint = id ? `/users/profile/${id}` : "/users/profile";
        const res = await API.get(endpoint);
        if (!ignore) {
          setProfileData(res.data);
        }
      } catch (err) {
        if (!ignore) {
          setMessage({
            type: "danger",
            text:
              err.response?.data?.message ||
              "Error al cargar la ficha del aventurero",
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return <Loader message="Consultando registros del gremio..." />;
  }

  const { user, posts, taverns } = profileData;
  const authorName = user?.username || user?.name || "Aventurero";
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    authorName,
  )}&background=dfd0b7&color=78350f`;

  return (
    <div className="container py-3" style={{ maxWidth: "80%" }}>
      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-outline-secondary mb-3 d-inline-flex align-items-center gap-1"
      >
        ← Volver
      </button>

      {/* Tarjeta de Perfil Principal */}
      <div
        className="card border-0 shadow-sm rounded-3 p-4 mb-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          border: "1px solid rgba(212, 175, 55, 0.3)",
        }}
      >
        <div className="row align-items-center">
          <div className="col-12 col-md-3 text-center mb-3 mb-md-0">
            <img
              src={user?.avatar || defaultAvatar}
              alt={authorName}
              className="rounded-circle object-fit-cover border border-3 border-warning shadow-sm mb-2"
              style={{ width: "110px", height: "110px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
          </div>

          <div className="col-12 col-md-9">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h2
                  className="fw-bold mb-1 text-dark"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  @{authorName}
                </h2>
                <p className="text-muted small mb-2">✉️ {user?.email}</p>
                <div className="d-flex gap-3 text-secondary small mb-2">
                  <span>
                    📝 <strong>{posts?.length || 0}</strong> Publicaciones
                  </span>
                  <span>
                    ⚜️ <strong>{taverns?.length || 0}</strong> Tabernas
                  </span>
                </div>
              </div>

              {isOwnProfile && currentUser?._id && (
                <Link
                  to={`/profile/${currentUser._id}`}
                  className="btn btn-outline-dark btn-sm fw-semibold"
                >
                  ✏️ Ir a Mi Perfil
                </Link>
              )}
            </div>

            <p className="mt-2 fst-italic text-dark mb-0">
              {user?.bio
                ? `"${user.bio}"`
                : "Este aventurero aún no ha escrito su biografía..."}
            </p>
          </div>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} mt-3 mb-0 py-2 small`}>
            {message.text}
          </div>
        )}
      </div>

      {/* BANNER 1: Tabernas unidas */}
      <div className="mb-4">
        <div
          className="card border-0 rounded-3 shadow-sm mb-3 p-3 d-flex flex-row align-items-center justify-content-between"
          style={{
            background:
              "linear-gradient(135deg, #4d3826 0%, #614833 50%, #3b2a1c 100%)",
            border: "1px solid rgba(212, 175, 55, 0.4)",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "1.2rem" }}>⚜️</span>
            <h5
              className="fw-bold mb-0"
              style={{ color: "#ffd700", fontFamily: "Georgia, serif" }}
            >
              Tabernas unidas
            </h5>
          </div>
          <span
            className="badge rounded-pill px-3 py-2 fw-bold"
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.2)",
              color: "#ffd700",
              border: "1px solid rgba(212, 175, 55, 0.4)",
            }}
          >
            {taverns?.length || 0}{" "}
            {taverns?.length === 1 ? "Taberna" : "Tabernas"}
          </span>
        </div>

        {!taverns || taverns.length === 0 ? (
          <div className="card p-4 text-center text-muted border-0 shadow-sm">
            Este aventurero aún no se ha unido a ninguna taberna.
          </div>
        ) : (
          <div className="row g-2">
            {taverns.map((tavern) => {
              const tavernId = tavern.id || tavern._id;
              return (
                <div key={tavernId} className="col-12 col-sm-6">
                  <Link
                    to={`/taverns/${tavernId}`}
                    className="text-decoration-none"
                  >
                    <div className="card h-100 border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
                      <img
                        src={
                          tavern.image ||
                          "https://placehold.co/50x50?text=Taberna"
                        }
                        alt={tavern.name}
                        className="rounded-circle object-fit-cover"
                        width="46"
                        height="46"
                      />
                      <div>
                        <h6 className="fw-bold text-dark mb-0">
                          {tavern.name}
                        </h6>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BANNER 2: Publicaciones */}
      <div>
        <div
          className="card border-0 rounded-3 shadow-sm mb-3 p-3 d-flex flex-row align-items-center justify-content-between"
          style={{
            background:
              "linear-gradient(135deg, #4d3826 0%, #614833 50%, #3b2a1c 100%)",
            border: "1px solid rgba(212, 175, 55, 0.4)",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "1.2rem" }}>⚜️</span>
            <h5
              className="fw-bold mb-0"
              style={{ color: "#ffd700", fontFamily: "Georgia, serif" }}
            >
              Publicaciones
            </h5>
          </div>
          <span
            className="badge rounded-pill px-3 py-2 fw-bold"
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.2)",
              color: "#ffd700",
              border: "1px solid rgba(212, 175, 55, 0.4)",
            }}
          >
            {posts?.length || 0}{" "}
            {posts?.length === 1 ? "Publicación" : "Publicaciones"}
          </span>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="card p-4 text-center text-muted border-0 shadow-sm">
            Este aventurero aún no ha escrito ninguna publicación.
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {posts.map((post) => {
              const postId = post.id || post._id;
              const tavernId = post.tavern?.id || post.tavern?._id;

              const upvotesCount =
                typeof post.upvotesCount === "number"
                  ? post.upvotesCount
                  : typeof post.likesCount === "number"
                    ? post.likesCount
                    : Array.isArray(post.upvotes)
                      ? post.upvotes.length
                      : Array.isArray(post.likes)
                        ? post.likes.length
                        : 0;

              const commentsCount =
                typeof post.commentsCount === "number"
                  ? post.commentsCount
                  : Array.isArray(post.comments)
                    ? post.comments.length
                    : 0;

              return (
                <div
                  key={postId}
                  onClick={() => navigate(`/posts/${postId}`)}
                  className="card border-0 p-3 shadow-sm rounded-3 bg-white"
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <h6 className="fw-bold mb-1 text-dark">{post.title}</h6>

                  {post.tavern && (
                    <div className="mb-2">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (tavernId) navigate(`/taverns/${tavernId}`);
                        }}
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
                    </div>
                  )}

                  <p className="mb-2 text-secondary small">{post.content}</p>

                  <div className="d-flex align-items-center gap-3 pt-2 border-top text-muted small">
                    <span className="d-flex align-items-center gap-1">
                      <span style={{ color: "#e63946" }}>♥</span>
                      <strong>{upvotesCount}</strong>
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        className="bi bi-chat-square-text opacity-75"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                        <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                      </svg>
                      <strong>{commentsCount}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
