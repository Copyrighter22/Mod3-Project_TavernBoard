// -----------------------------------------------------------------------------
// PÁGINA PRINCIPAL / FEED GENERAL DE PUBLICACIONES
// -----------------------------------------------------------------------------
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import PostForm from "../components/post_components/PostForm";
import PostCard from "../components/post_components/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const endpoint =
          filter === "my-taverns" ? "/posts/my-taverns" : "/posts";
        const res = await API.get(endpoint);
        setPosts(res.data);
      } catch (err) {
        console.error("Error al obtener los posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter]);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((p) => (p.id || p._id) !== deletedId),
    );
  };

  const handleLikeSuccess = (updatedPost) => {
    const targetId = updatedPost.id || updatedPost._id;
    setPosts((prevPosts) =>
      prevPosts.map((p) => ((p.id || p._id) === targetId ? updatedPost : p)),
    );
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {user && (
            <div className="mb-4">
              <PostForm onPostCreated={handlePostCreated} />
            </div>
          )}

          <div className="d-flex gap-2 mb-4">
            <button
              className={`btn btn-sm fw-semibold ${
                filter === "all" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setFilter("all")}
            >
              <i className="bi bi-globe me-1"></i> Todos los Posts
            </button>
            {user && (
              <button
                className={`btn btn-sm fw-semibold ${
                  filter === "my-taverns"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setFilter("my-taverns")}
              >
                <i className="bi bi-shield-shaded me-1"></i> Mis Tabernas
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="card p-4 text-center text-muted">
              No hay publicaciones para mostrar en este momento.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id || post._id}
                  post={post}
                  onLikeSuccess={handleLikeSuccess}
                  onDelete={handlePostDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
