import { useState, useEffect } from "react";
import { getMyProfile } from "../services/userService";
import Navbar from "../components/Navbar";
import PostCard from "../components/post_components/PostCard";
import TavernCard from "../components/tavern_components/TavernCard";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfileData(data);
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
          Cargando perfil...
        </p>
      </>
    );
  }

  if (!profileData) {
    return (
      <>
        <Navbar />
        <p style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>
          Error al cargar los datos del perfil.
        </p>
      </>
    );
  }

  const { user, posts, taverns } = profileData;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
        {/* Ficha básica de usuario */}
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
          <h1 style={{ color: "#f39c12", margin: "0 0 0.5rem 0" }}>
            @{user.username || user.name}
          </h1>
          <p style={{ color: "#aaa", margin: 0 }}>📧 {user.email}</p>
        </div>

        {/* Tabernas a las que pertenece */}
        <h2 style={{ color: "#fff", textAlign: "left", marginBottom: "1rem" }}>
          Mis Tabernas ({taverns.length})
        </h2>
        {taverns.length === 0 ? (
          <p style={{ color: "#888", textAlign: "left", marginBottom: "2rem" }}>
            Aún no perteneces a ninguna taberna.
          </p>
        ) : (
          <div style={{ marginBottom: "2rem" }}>
            {taverns.map((tavern) => (
              <TavernCard key={tavern._id} tavern={tavern} />
            ))}
          </div>
        )}

        {/* Publicaciones creadas por el usuario */}
        <h2 style={{ color: "#fff", textAlign: "left", marginBottom: "1rem" }}>
          Mis Publicaciones ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <p style={{ color: "#888", textAlign: "left" }}>
            Aún no has creado publicaciones.
          </p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </>
  );
};

export default ProfilePage;
