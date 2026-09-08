// -----------------------------------------------------------------------------
// PÁGINA DE INICIO DE SESIÓN (LOGIN)
// -----------------------------------------------------------------------------
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center p-3"
      style={{ minHeight: "90vh" }}
    >
      <div className="w-100" style={{ maxWidth: "80%" }}>
        <div
          className="card shadow-sm border-0 p-4 rounded-3"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
              Bienvenido de nuevo
            </h3>
            <p className="small" style={{ color: "var(--text-muted)" }}>
              Ingresa a tu cuenta para continuar en la aventura
            </p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control border-end-0"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="input-group-text bg-transparent border-start-0"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold mb-3"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="text-center small mt-2">
            <span style={{ color: "var(--text-muted)" }}>
              ¿No tienes cuenta?{" "}
            </span>
            <Link
              to="/register"
              className="fw-bold text-decoration-none"
              style={{ color: "var(--accent-amber)" }}
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
