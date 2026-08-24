import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import PostCard from './components/PostCard';
import { getPosts, createPost, deletePost, toggleLike } from './services/postService';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        if (isMounted) setPosts(data);
      } catch (err) {
        console.error('Error al cargar publicaciones:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePostCreated = async (newPostData) => {
    const createdPost = await createPost(newPostData);
    setPosts((prevPosts) => [createdPost, ...prevPosts]);
  };

  const handleLike = async (postId) => {
    try {
      const updatedPost = await toggleLike(postId);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === postId ? updatedPost : p))
      );
    } catch (err) {
      console.error('Error al dar me gusta:', err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error('Error al eliminar publicación:', err);
    }
  };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>
        <PostForm onPostCreated={handlePostCreated} />

        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando publicaciones...</p>
        ) : posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>
            No hay publicaciones aún. ¡Sé el primero en escribir!
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
      </main>
    </div>
  );
}

export default App;