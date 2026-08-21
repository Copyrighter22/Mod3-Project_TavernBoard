import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.js';
import Navbar from './components/Navbar';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <main style={{ padding: '0 2rem', textAlign: 'center' }}>
        <h1>Tavern Board Social App</h1>
        {user ? (
          <p style={{ marginTop: '1rem', color: '#2ecc71', fontSize: '1.1rem' }}>
            ¡Bienvenido a la taberna, <strong>{user.username || user.name}</strong>! Estás autenticado.
          </p>
        ) : (
          <p style={{ marginTop: '1rem', color: '#888' }}>
            Inicia sesión o regístrate para publicar y compartir tus aventuras.
          </p>
        )}
      </main>
    </div>
  );
}

export default App;