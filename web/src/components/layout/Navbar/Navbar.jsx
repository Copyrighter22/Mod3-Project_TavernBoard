// -----------------------------------------------------------------------------
// COMPONENTE NAVBAR (BARRA DE NAVEGACIÓN Y BÚSQUEDA INTERACTIVA)
// -----------------------------------------------------------------------------
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import API from "../../../services/api";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados del Buscador
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ taverns: [], users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef(null);
  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Manejador del cambio en el input (evento directo de usuario)
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    // Si el usuario borra todo, limpiamos inmediatamente sin pasar por el useEffect
    if (!val.trim()) {
      setResults({ taverns: [], users: [], posts: [] });
      setShowDropdown(false);
    }
  };

  // Efecto exclusivamente para la búsqueda asíncrona a la API
  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await API.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Error al buscar:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Cerrar desplegable si se hace clic fuera del buscador
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (path) => {
    setQuery("");
    setShowDropdown(false);
    navigate(path);
  };

  const hasResults =
    results.taverns.length > 0 ||
    results.users.length > 0 ||
    results.posts.length > 0;

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top mb-4"
      style={{
        backgroundColor: "#e2d5c3",
        borderBottom: "1px solid #c2b29a",
      }}
    >
      <div className="container-fluid px-3 px-md-4">
        {/* Brand / Logo */}
        <Link
          className="navbar-brand d-flex align-items-center gap-3 fw-bold flex-shrink-0 me-3"
          to="/"
        >
          <img
            src="https://res.cloudinary.com/kro9urjy/image/upload/v1788810677/JabaliDanzanteOffi.png"
            alt="El Jabalí Danzante Logo"
            style={{
              height: "120px",
              width: "auto",
            }}
            className="object-fit-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span
            className="fs-3"
            style={{ color: "var(--text-main)", fontFamily: "Georgia, serif" }}
          >
            El Jabalí Danzante
          </span>
        </Link>

        {/* Buscador Interactivo */}
        <div
          ref={searchRef}
          className="mx-auto my-2 my-lg-0 flex-grow-1 search-container"
          style={{ maxWidth: "600px" }}
        >
          <div className="input-group">
            <span
              className="input-group-text bg-transparent border-end-0"
              style={{ borderColor: "#c2b29a" }}
            >
              {loading ? (
                <div
                  className="spinner-border spinner-border-sm text-muted"
                  role="status"
                />
              ) : (
                <i className="bi bi-search text-muted"></i>
              )}
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              style={{ backgroundColor: "#dfd0b7", borderColor: "#c2b29a" }}
              placeholder="Buscar tabernas, publicaciones, aventureros..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => query.trim() && setShowDropdown(true)}
            />
          </div>

          {/* Menú Desplegable de Resultados */}
          {showDropdown && (
            <div className="search-results-dropdown">
              {!hasResults && !loading ? (
                <div className="p-3 text-center text-muted small">
                  No se hallaron pergaminos ni aventureros con esa marca.
                </div>
              ) : (
                <>
                  {/* Tabernas */}
                  {results.taverns.length > 0 && (
                    <div>
                      <div className="search-section-title">
                        <i className="bi bi-shield-shaded me-1"></i> Tabernas
                      </div>
                      {results.taverns.map((tavern) => (
                        <div
                          key={tavern._id || tavern.id}
                          className="search-result-item"
                          onClick={() =>
                            handleSelectResult(
                              `/taverns/${tavern._id || tavern.id}`,
                            )
                          }
                        >
                          <i className="bi bi-house-door text-amber fs-5 me-1"></i>
                          <span className="fw-semibold small">
                            {tavern.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Aventureros (Usuarios) */}
                  {results.users.length > 0 && (
                    <div>
                      <div className="search-section-title">
                        <i className="bi bi-person-badge me-1"></i> Aventureros
                      </div>
                      {results.users.map((u) => (
                        <div
                          key={u._id || u.id}
                          className="search-result-item"
                          onClick={() =>
                            handleSelectResult(`/profile/${u._id || u.id}`)
                          }
                        >
                          <img
                            src={u.avatar || defaultAvatar}
                            alt={u.username}
                            className="search-result-avatar"
                          />
                          <span className="fw-semibold small">
                            @{u.username}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Publicaciones */}
                  {results.posts.length > 0 && (
                    <div>
                      <div className="search-section-title">
                        <i className="bi bi-journal-text me-1"></i>{" "}
                        Publicaciones
                      </div>
                      {results.posts.map((p) => (
                        <div
                          key={p._id || p.id}
                          className="search-result-item"
                          onClick={() =>
                            handleSelectResult(`/posts/${p._id || p.id}`)
                          }
                        >
                          <i className="bi bi-file-earmark-text me-1 text-muted"></i>
                          <div className="text-truncate small">
                            <span className="fw-semibold">{p.title}</span>
                            {p.author?.username && (
                              <span className="text-muted ms-1">
                                de @{p.author.username}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Menú de Usuario */}
        <div className="d-flex align-items-center gap-3 flex-shrink-0 ms-3">
          {user ? (
            <>
              <Link
                to="/taverns"
                className="btn btn-medieval d-flex align-items-center gap-2 shadow-sm"
              >
                <i className="bi bi-compass-fill"></i>
                <span>Explorar Tabernas</span>
              </Link>

              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2 border-0 bg-transparent dropdown-toggle p-0"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user.avatar || defaultAvatar}
                    alt={user.username || "Usuario"}
                    className="rounded-circle object-fit-cover"
                    width="38"
                    height="38"
                    style={{ border: "2px solid var(--accent-amber)" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <span
                    className="fw-semibold small"
                    style={{ color: "var(--text-main)" }}
                  >
                    {user.username}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li>
                    <Link
                      className="dropdown-item small"
                      to={`/profile/${user._id}`}
                    >
                      <i className="bi bi-person me-2"></i> Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item small text-danger"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Cerrar
                      Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm fw-semibold">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
