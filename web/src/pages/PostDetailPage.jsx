// -----------------------------------------------------------------------------
// PÁGINA DETALLE DE PUBLICACIÓN Y COMENTARIOS
// -----------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import PostCard from "../components/post_components/PostCard";
import CommentSection from "../components/post_components/CommentSection";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error al cargar la publicación.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLikeSuccess = (updatedPost) => {
    setPost(updatedPost);
  };

  const handleDeletePost = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-2 text-muted">Cargando publicación...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container my-4 text-center">
        <div className="alert alert-danger">
          {error || "Publicación no encontrada"}
        </div>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          ← Volver al feed
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-3" style={{ maxWidth: "80%" }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-outline-secondary mb-3 d-inline-flex align-items-center gap-1"
      >
        ← Volver
      </button>

      <PostCard
        post={post}
        onLikeSuccess={handleLikeSuccess}
        onDelete={handleDeletePost}
        showAllComments={true}
      />

      <div className="card p-3 shadow-sm border rounded-3 bg-white mt-3">
        <CommentSection postId={post.id || post._id} />
      </div>
    </div>
  );
}
