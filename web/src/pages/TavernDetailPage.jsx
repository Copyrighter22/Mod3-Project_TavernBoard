import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTavernById, toggleJoinTavern } from "../services/tavernService";
import {
  getPostsByTavern,
  createPost,
  toggleLike,
  deletePost,
} from "../services/postService";
import Navbar from "../components/Navbar";
import PostForm from "../components/post_components/PostForm";
import PostCard from "../components/post_components/PostCard";

const TavernDetailPage = () => {
  const { id } = useParams();
  const [tavern, setTavern] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de la taberna y sus publicaciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tavernData = await getTavernById(id);
        const postsData = await getPostsByTavern(id);
        setTavern(tavernData);
        setPosts(postsData);
      } catch (err) {
        console.error("Error al cargar la taberna:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Crear post inyectando automáticamente la ID de esta taberna
  const handleCreatePost = async (postData) => {
    const newPost = await createPost({ ...postData, tavernId: id });
    setPosts([newPost, ...posts]);
  };

  const handleLike = async (postId) => {
    const updatedPost = await toggleLike(postId);
    setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
  };

  const handleDelete = async (postId) => {
    await deletePost(postId);
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const handleToggleJoin = async () => {
    const updatedTavern = await toggleJoinTavern(id);
    setTavern(updatedTavern);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
          Cargando taberna...
        </p>
      </>
    );
  }

  if (!tavern) {
    return (
      <>
        <Navbar />
        <p style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
          Taberna no encontrada
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
        {/* Cabecera de la Taberna */}
        <div
          style={{
            backgroundColor: "#222",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "left",
            border: "1px solid #444",
          }}
        >
          <div
            style={{
              display: "flex",
              justify: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ color: "#f39c12", margin: 0 }}>{tavern.name}</h1>
            <button
              onClick={handleToggleJoin}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#3498db",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Unirse / Salir ({tavern.members?.length || 0})
            </button>
          </div>
          <p style={{ color: "#ccc", marginTop: "0.8rem" }}>
            {tavern.description}
          </p>
        </div>

        {/* Formulario de publicación asignado automáticamente a esta taberna */}
        <PostForm onPostCreated={handleCreatePost} />

        {/* Listado de Posts de esta taberna */}
        <h2 style={{ color: "#fff", textAlign: "left", marginBottom: "1rem" }}>
          Tablón de Anuncios
        </h2>
        {posts.length === 0 ? (
          <p style={{ color: "#888", textAlign: "left" }}>
            Aún no hay publicaciones en esta taberna.
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

export default TavernDetailPage;
