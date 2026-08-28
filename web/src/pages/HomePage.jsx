import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import {
  getPosts,
  getJoinedPosts,
  toggleLike,
  deletePost,
} from "../services/postService";
import Navbar from "../components/Navbar";
import PostCard from "../components/post_components/PostCard";
import PostForm from "../components/post_components/PostForm";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' | 'joined'
  const [loading, setLoading] = useState(true);

  // Función para re-obtener publicaciones tras crear un post
  const refreshPosts = async () => {
    try {
      const data =
        filter === "joined" ? await getJoinedPosts() : await getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error al recargar publicaciones:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const data =
          filter === "joined" ? await getJoinedPosts() : await getPosts();
        if (isMounted) setPosts(data);
      } catch (err) {
        console.error("Error al cargar publicaciones:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    if (filter !== newFilter) {
      setLoading(true);
      setFilter(newFilter);
    }
  };

  const handleLike = async (postId) => {
    const updated = await toggleLike(postId);
    setPosts(posts.map((p) => (p._id === postId ? updated : p)));
  };

  const handleDelete = async (postId) => {
    await deletePost(postId);
    setPosts(posts.filter((p) => p._id !== postId));
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
        <PostForm onPostCreated={refreshPosts} />

        {/* Pestañas de filtrado */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <button
            onClick={() => handleFilterChange("all")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: filter === "all" ? "#3498db" : "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🌐 Todos los Posts
          </button>

          {user && (
            <button
              onClick={() => handleFilterChange("joined")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: filter === "joined" ? "#3498db" : "#222",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🛡️ Mis Tabernas
            </button>
          )}
        </div>

        {/* Listado de publicaciones */}
        {loading ? (
          <p style={{ color: "#fff" }}>Cargando publicaciones...</p>
        ) : posts.length === 0 ? (
          <p style={{ color: "#888" }}>
            {filter === "joined"
              ? "No hay publicaciones en las tabernas a las que te has unido."
              : "No hay publicaciones disponibles."}
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </>
  );
};

export default HomePage;
