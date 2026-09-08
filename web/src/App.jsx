// -----------------------------------------------------------------------------
// CONFIGURACIÓN DE RUTAS Y PROVEEDORES DE LA APLICACIÓN
// -----------------------------------------------------------------------------
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar/Navbar";

// Páginas
import HomePage from "./pages/HomePage";
import TavernPage from "./pages/TavernPage";
import TavernDetailPage from "./pages/TavernDetailPage";
import UserDetailPage from "./pages/UserDetailPage";
import ProfilePage from "./pages/ProfilePage";
import PostDetailPage from "./pages/PostDetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageLayout from "./components/layout/PageLayout/PageLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <PageLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/taverns" element={<TavernPage />} />
            <Route path="/taverns/:id" element={<TavernDetailPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
