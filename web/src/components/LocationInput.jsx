// -----------------------------------------------------------------------------
// COMPONENTE BÚSQUEDA DE UBICACIÓN CON AUTOCOMPLETADO (OPENSTREETMAP NOMINATIM)
// -----------------------------------------------------------------------------
import { useState, useEffect } from "react";

const LocationInput = ({ onSelectLocation, initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            trimmed,
          )}&addressdetails=1&limit=5&accept-language=es`,
        );
        const data = await response.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      onSelectLocation(null);
    }
  };

  const handleSelect = (item) => {
    const cityName =
      item.address.city ||
      item.address.town ||
      item.address.village ||
      item.address.municipality ||
      item.display_name.split(",")[0];

    const stateName = item.address.state || item.address.province || "";
    const formattedName = stateName ? `${cityName}, ${stateName}` : cityName;

    const selectedLoc = {
      name: formattedName,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    };

    setQuery(formattedName);
    setShowDropdown(false);
    onSelectLocation(selectedLoc);
  };

  return (
    <div className="position-relative">
      <div
        className="input-group input-group-sm rounded-2 overflow-hidden"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <span className="input-group-text bg-transparent border-0 pe-1">
          <i
            className="bi bi-geo-alt-fill"
            style={{ color: "#ea4335", fontSize: "1rem" }}
          ></i>
        </span>
        <input
          type="text"
          className="form-control bg-transparent border-0 shadow-none ps-1 text-dark"
          placeholder="¿Dónde te gustaría organizar la partida? (Ej: Sabadell, Barcelona...)"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim().length >= 3 && setShowDropdown(true)}
        />
        {loading && (
          <span className="input-group-text bg-transparent border-0 pe-2">
            <span className="spinner-border spinner-border-sm text-warning"></span>
          </span>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul
          className="dropdown-menu show w-100 shadow-sm mt-1 overflow-auto border-0"
          style={{ maxHeight: "200px", zIndex: 1050 }}
        >
          {suggestions.map((item) => (
            <li key={item.place_id}>
              <button
                type="button"
                className="dropdown-item py-2 small d-flex align-items-center gap-2"
                onClick={() => handleSelect(item)}
              >
                <i className="bi bi-geo-alt-fill text-danger"></i>
                <div>
                  <strong>{item.display_name.split(",")[0]}</strong>
                  <span className="text-muted d-block small">
                    {item.display_name.split(",").slice(1, 3).join(",")}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
