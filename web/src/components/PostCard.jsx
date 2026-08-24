import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

const PostCard = ({ post, onLike, onDelete }) => {
  const { user } = useContext(AuthContext);

  const isAuthor =
    user && (user._id === post.author?._id || user._id === post.author);

  // 1. Cambiado de post.likes a post.upvotes
  const hasLiked = user && post.upvotes?.includes(user._id);

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#1a1a1a",
        color: "#fff", // 2. Color blanco general para asegurar legibilidad
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <strong style={{ color: "#3498db" }}>
          @{post.author?.username || post.author?.name || "Tabernero"}
        </strong>
        <small style={{ color: "#888" }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </small>
      </div>

      {post.title && (
        <h3 style={{ margin: "0.5rem 0", color: "#fff" }}>{post.title}</h3>
      )}

      {/* 3. Color claro explícito (#e0e0e0) para ver el cuerpo del mensaje */}
      <p
        style={{
          margin: "0.5rem 0 1rem 0",
          whiteSpace: "pre-line",
          color: "#e0e0e0",
        }}
      >
        {post.content}
      </p>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={() => onLike(post._id)}
          style={{
            backgroundColor: hasLiked ? "#ff8a8a" : "#333",
            color: "#fff",
            border: "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ❤️ {post.upvotes?.length || 0}
        </button>

        {isAuthor && (
          <button
            onClick={() => onDelete(post._id)}
            style={{
              backgroundColor: "transparent",
              color: "#ff4d4d",
              border: "1px solid #ff4d4d",
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
