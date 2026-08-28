import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostForm from "../components/post_components/PostForm";
import PostCard from "../components/post_components/PostCard";
import { getTavernById } from "../services/tavernService";
import { createPost, toggleLike, deletePost } from "../services/postService";

const TavernDetailPage = () => {
  const { id } = useParams();
  const [tavern, setTavern] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función de refresco manual para llamar tras eventos (como crear post)
  const refreshTavernDetails = async () => {
    try {
      const data = await getTavernById(id);
      setTavern(data.tavern || data);
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Error al refrescar la taberna:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialTavernDetails = async () => {
      try {
        const data = await getTavernById(id);
        if (isMounted) {
          setTavern(data.tavern || data);
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error("Error al cargar la taberna:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialTavernDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePostCreated = async (newPostData) => {
    await createPost(newPostData);
    refreshTavernDetails();
  };

  const handleLike = async (postId) => {
    const updated = await toggleLike(postId);
    setPosts(posts.map((p) => (p._id === postId ? updated : p)));
  };

  const handleDelete = async (postId) => {
    await deletePost(postId);
    setPosts(posts.filter((p) => p._id !== postId));
  };

  if (loading)
    return (
      <>
        <Navbar />
        <p style={{ color: "#fff", textAlign: "center" }}>Cargando...</p>
      </>
    );

  if (!tavern)
    return (
      <>
        <Navbar />
        <p style={{ color: "#fff", textAlign: "center" }}>
          Taberna no encontrada.
        </p>
      </>
    );

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
        <div
          style={{
            backgroundColor: "#1e1e1e",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          <h1 style={{ color: "#f39c12", margin: 0 }}>🏰 {tavern.name}</h1>
          <p style={{ color: "#ccc" }}>{tavern.description}</p>
          <span style={{ color: "#aaa" }}>
            👥 {tavern.members?.length || 0} miembros
          </span>
        </div>

        {/* Incluimos tavernId para asociar el post a la taberna */}
        <PostForm onPostCreated={handlePostCreated} tavernId={id} />

        <h2 style={{ color: "#fff", textAlign: "left" }}>
          Publicaciones de la taberna
        </h2>
        {posts.length === 0 ? (
          <p style={{ color: "#888" }}>
            No hay publicaciones en esta taberna todavía.
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              tavernOwnerId={tavern.owner?._id || tavern.owner}
            />
          ))
        )}
      </div>
    </>
  );
};

export default TavernDetailPage;