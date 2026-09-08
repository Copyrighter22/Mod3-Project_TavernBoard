// -----------------------------------------------------------------------------
// COMPONENTE FORMULARIO DE CREACIÓN DE PUBLICACIONES
// -----------------------------------------------------------------------------
import { useState } from "react";
import LocationInput from "../LocationInput";
import API from "../../services/api";

const PostForm = ({ onPostCreated, tavernId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      setError("Solo puedes subir un máximo de 5 imágenes.");
      return;
    }

    setError("");
    const updatedFiles = [...selectedFiles, ...files].slice(0, 5);
    setSelectedFiles(updatedFiles);

    const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    const updatedPreviews = updatedFiles.map((file) =>
      URL.createObjectURL(file),
    );
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("El título y el contenido son obligatorios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (tavernId) {
        formData.append("tavernId", tavernId);
      }

      // Solo adjunta ubicación si realmente existe
      if (selectedLocation && selectedLocation.name) {
        formData.append("location", JSON.stringify(selectedLocation));
      }

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // NO pasar headers manualmente; Axios añade el boundary necesario para Multer
      const res = await API.post("/posts", formData);

      if (onPostCreated) {
        onPostCreated(res.data);
      }

      // Limpia el formulario
      setTitle("");
      setContent("");
      setSelectedLocation(null);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err.response?.data?.message || "Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
      <h5 className="fw-bold mb-3" style={{ color: "var(--text-main)" }}>
        ✍️ Crear una publicación
      </h5>

      {error && <div className="alert alert-danger py-1 small">{error}</div>}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Título del anuncio o quedada..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="form-control"
          rows="3"
          placeholder="Busco 3 jugadores para campaña de D&D, traed dados..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>

        <div className="mt-1">
          <LocationInput onSelectLocation={(loc) => setSelectedLocation(loc)} />
        </div>

        <div className="mt-2">
          <label className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 cursor-pointer">
            <i className="bi bi-image"></i>
            <span>Añadir imágenes ({selectedFiles.length}/5)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              hidden
              disabled={selectedFiles.length >= 5}
            />
          </label>
        </div>

        {previews.length > 0 && (
          <div className="d-flex gap-2 flex-wrap mt-2">
            {previews.map((src, idx) => (
              <div
                key={idx}
                className="position-relative"
                style={{ width: "60px", height: "60px" }}
              >
                <img
                  src={src}
                  alt="preview"
                  className="w-100 h-100 object-fit-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center"
                  style={{
                    width: "18px",
                    height: "18px",
                    fontSize: "10px",
                    borderRadius: "50%",
                    transform: "translate(30%, -30%)",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-end mt-2">
          <button
            type="submit"
            className="btn btn-warning btn-sm text-dark fw-bold px-3"
            disabled={loading}
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
