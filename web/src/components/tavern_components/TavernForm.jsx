// -----------------------------------------------------------------------------
// COMPONENTE FORMULARIO DE CREACIÓN DE TABERNA
// -----------------------------------------------------------------------------
import { useState } from "react";
import { createTavern } from "../../services/tavernService";

// Constantes por defecto para la previsualización
const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1590845947376-2638caa89309?q=80&w=1000&auto=format&fit=crop";
const DEFAULT_ICON = "https://cdn-icons-png.flaticon.com/512/3673/3673092.png";

const TavernForm = ({ onTavernCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Archivos de imagen
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // Enlaces URL alternativos (para Cloudinary / URLs directas)
  const [imageUrl, setImageUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  // Modo de inserción de imagen ("file" o "url")
  const [imageInputMode, setImageInputMode] = useState("file");
  const [bannerInputMode, setBannerInputMode] = useState("file");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener URL activa para previsualización
  const getPreviewIcon = () => {
    if (imageInputMode === "file" && imageFile)
      return URL.createObjectURL(imageFile);
    if (imageInputMode === "url" && imageUrl.trim()) return imageUrl;
    return DEFAULT_ICON;
  };

  const getPreviewBanner = () => {
    if (bannerInputMode === "file" && bannerFile)
      return URL.createObjectURL(bannerFile);
    if (bannerInputMode === "url" && bannerUrl.trim()) return bannerUrl;
    return DEFAULT_BANNER;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("El nombre y la descripción son obligatorios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      // Adjuntar Icono (Archivo o URL)
      if (imageInputMode === "file" && imageFile) {
        formData.append("image", imageFile);
      } else if (imageInputMode === "url" && imageUrl.trim()) {
        formData.append("image", imageUrl.trim());
      }

      // Adjuntar Banner (Archivo o URL)
      if (bannerInputMode === "file" && bannerFile) {
        formData.append("banner", bannerFile);
      } else if (bannerInputMode === "url" && bannerUrl.trim()) {
        formData.append("banner", bannerUrl.trim());
      }

      await createTavern(formData);

      // Limpiar Formulario
      setName("");
      setDescription("");
      setImageFile(null);
      setBannerFile(null);
      setImageUrl("");
      setBannerUrl("");

      if (onTavernCreated) onTavernCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Error al fundar la taberna");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
      <h4 className="fw-bold mb-3" style={{ color: "var(--text-main)" }}>
        🏰 Fundar una Nueva Taberna
      </h4>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {/* Nombre */}
            <div>
              <label className="form-label fw-semibold small text-muted mb-1">
                Nombre de la Taberna *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. La Taberna del Dragón"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="form-label fw-semibold small text-muted mb-1">
                Descripción *
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Escribe la historia o propósito de tu taberna..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Configuración de Icono */}
            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-semibold small text-muted mb-0">
                  Icono / Escudo
                </label>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className={`btn ${imageInputMode === "file" ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => setImageInputMode("file")}
                  >
                    Archivo
                  </button>
                  <button
                    type="button"
                    className={`btn ${imageInputMode === "url" ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => setImageInputMode("url")}
                  >
                    URL Link
                  </button>
                </div>
              </div>

              {imageInputMode === "file" ? (
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              ) : (
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://res.cloudinary.com/.../icono.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              )}
            </div>

            {/* Configuración de Banner */}
            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-semibold small text-muted mb-0">
                  Banner de Cabecera
                </label>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className={`btn ${bannerInputMode === "file" ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => setBannerInputMode("file")}
                  >
                    Archivo
                  </button>
                  <button
                    type="button"
                    className={`btn ${bannerInputMode === "url" ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() => setBannerInputMode("url")}
                  >
                    URL Link
                  </button>
                </div>
              </div>

              {bannerInputMode === "file" ? (
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files[0])}
                />
              ) : (
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://res.cloudinary.com/.../banner.jpg"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                />
              )}
            </div>

            {/* Botón Guardar */}
            <div className="d-flex justify-content-end mt-2">
              <button
                type="submit"
                className="btn btn-warning text-dark fw-bold px-4"
                disabled={loading}
              >
                {loading ? "Fundando..." : "Crear Taberna"}
              </button>
            </div>
          </form>
        </div>

        {/* Vista Previa en Tiempo Real */}
        <div className="col-lg-5">
          <label className="form-label fw-semibold small text-muted mb-2">
            👁️ Vista Previa
          </label>
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden bg-white">
            <div style={{ position: "relative", height: "110px" }}>
              <img
                src={getPreviewBanner()}
                alt="Banner Preview"
                className="w-100 h-100 object-fit-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_BANNER;
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "15px",
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  border: "3px solid #fff",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  zIndex: 2,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src={getPreviewIcon()}
                  alt="Icon Preview"
                  className="w-100 h-100 object-fit-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_ICON;
                  }}
                />
              </div>
            </div>

            <div className="card-body" style={{ paddingTop: "30px" }}>
              <h6 className="fw-bold mb-1 text-truncate">
                {name.trim() || "Nombre de la Taberna"}
              </h6>
              <p className="small text-muted mb-2 text-truncate">
                {description.trim() || "La descripción aparecerá aquí..."}
              </p>
              <span className="badge bg-light text-dark border">
                👥 1 miembros
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavernForm;
