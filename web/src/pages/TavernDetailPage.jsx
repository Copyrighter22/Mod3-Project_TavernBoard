// -----------------------------------------------------------------------------
// PÁGINA DE DETALLE DE UNA TABERNA Y SUS PUBLICACIONES
// -----------------------------------------------------------------------------
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../components/post_components/PostForm";
import PostCard from "../components/post_components/PostCard";
import Loader from "../components/Loader";
import { getTavernById, toggleJoinTavern } from "../services/tavernService";
import { AuthContext } from "../context/AuthContext";

const TavernDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tavern, setTavern] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setLoading(true);
    setTavern(null);
    setPosts([]);
  }

  useEffect(() => {
    let isMounted = true;

    const loadInitialTavernDetails = async () => {
      try {
        const data = await getTavernById(id);
        if (isMounted) {
          setTavern(data.tavern || data);
          setPosts(data.posts || []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error al cargar la taberna:", err);
        if (isMounted) setLoading(false);
      }
    };

    loadInitialTavernDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleJoinToggle = async () => {
    if (!user) return;
    setJoining(true);
    try {
      const updatedTavern = await toggleJoinTavern(id);
      setTavern(updatedTavern);
    } catch (err) {
      console.error("Error al cambiar estado de membresía:", err);
    } finally {
      setJoining(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleDelete = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((p) => (p.id || p._id) !== deletedPostId),
    );
  };

  const handleLikeSuccess = (updatedPost) => {
    const targetId = updatedPost.id || updatedPost._id;
    setPosts((prevPosts) =>
      prevPosts.map((p) => ((p.id || p._id) === targetId ? updatedPost : p)),
    );
  };

  if (loading) {
    return <Loader message="Entrando en las profundidades de la taberna..." />;
  }

  if (!tavern) {
    return (
      <div className="card border-0 p-4 text-center rounded-3 shadow-sm my-4">
        <p className="mb-0 text-muted">Taberna no encontrada.</p>
      </div>
    );
  }

  const currentUserId = user?.id || user?._id;
  const isMember = tavern.members?.some((member) => {
    const memberId =
      typeof member === "object" ? member.id || member._id : member;
    return String(memberId) === String(currentUserId);
  });

  return (
    <div className="container py-2" style={{ maxWidth: "80%" }}>
      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-outline-secondary mb-3 d-inline-flex align-items-center gap-1"
      >
        ← Volver
      </button>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
        {tavern.banner && (
          <img
            src={tavern.banner}
            alt="Banner de la taberna"
            className="w-100 object-fit-cover"
            style={{ height: "180px" }}
          />
        )}
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              {tavern.image && (
                <img
                  src={tavern.image}
                  alt={tavern.name}
                  className="rounded-circle object-fit-cover border"
                  width="64"
                  height="64"
                />
              )}
              <div>
                <h2
                  className="fw-bold mb-1"
                  style={{ color: "var(--text-main)" }}
                >
                  ⚜️ {tavern.name}
                </h2>
                <span className="badge bg-secondary">
                  👥 {tavern.members?.length || 0} Miembros
                </span>
              </div>
            </div>

            {user && (
              <button
                className={`btn fw-semibold ${
                  isMember ? "btn-outline-danger" : "btn-warning text-dark"
                }`}
                onClick={handleJoinToggle}
                disabled={joining}
              >
                <i
                  className={`bi bi-${
                    isMember ? "box-arrow-left" : "person-plus-fill"
                  } me-1`}
                ></i>
                {joining
                  ? "Procesando..."
                  : isMember
                    ? "Salir de la Taberna"
                    : "Unirse a la Taberna"}
              </button>
            )}
          </div>

          <p className="mt-3 mb-0" style={{ color: "var(--text-main)" }}>
            {tavern.description}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <PostForm onPostCreated={handlePostCreated} tavernId={id} />
      </div>

      <h4 className="fw-bold mb-3" style={{ color: "var(--text-main)" }}>
        Publicaciones de la taberna
      </h4>

      {posts.length === 0 ? (
        <div className="card border-0 p-4 text-center rounded-3 shadow-sm">
          <p className="mb-0 text-muted">
            No hay publicaciones en esta taberna todavía. ¡Sé el primero en
            escribir algo!
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {posts.map((post) => (
            <PostCard
              key={post.id || post._id}
              post={post}
              onLikeSuccess={handleLikeSuccess}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TavernDetailPage;
