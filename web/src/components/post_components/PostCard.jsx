import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import CommentSection from "./CommentSection";

const PostCard = ({ post, onLike, onDelete, tavernOwnerId }) => {
  const { user } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);

  // Permiso para borrar el post: Autor del post O Dueño de la taberna
  const isPostAuthor =
    user && (post.author?._id === user._id || post.author === user._id);
  const isTavernAdmin = user && tavernOwnerId && user._id === tavernOwnerId;
  const canDeletePost = isPostAuthor || isTavernAdmin;

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#111",
        color: "#fff",
        textAlign: "left",
      }}
    >
      <h3 style={{ margin: "0 0 0.5rem 0", color: "#f39c12" }}>{post.title}</h3>
      <p style={{ color: "#e0e0e0" }}>{post.content}</p>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        {user && (
          <button
            onClick={() => onLike(post._id)}
            style={{
              backgroundColor: "#222",
              color: "#fff",
              border: "1px solid #444",
              padding: "0.3rem 0.6rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ❤️ {post.upvotes?.length || 0}
          </button>
        )}

        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            backgroundColor: "transparent",
            color: "#aaa",
            border: "1px solid #444",
            padding: "0.3rem 0.6rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          💬 Comentarios
        </button>

        {/* Solo visible si es el autor del post o el admin de la taberna */}
        {canDeletePost && (
          <button
            onClick={() => onDelete(post._id)}
            style={{
              backgroundColor: "#e74c3c",
              color: "#fff",
              border: "none",
              padding: "0.3rem 0.6rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🗑️ Eliminar
          </button>
        )}
      </div>

      {showComments && <CommentSection postId={post._id} />}
    </div>
  );
};

export default PostCard;
