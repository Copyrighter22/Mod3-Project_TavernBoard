// -----------------------------------------------------------------------------
// COMPONENTE PANTALLA DE CARGA (LOADER)
// -----------------------------------------------------------------------------
import { RingLoader } from "react-spinners";

function Loader({ message = "Un Anillo para gobernarlos a todos..." }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(10, 8, 5, 0.82)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
      }}
    >
      <div
        className="d-flex justify-content-center align-items-center rounded-circle mb-3"
        style={{
          width: "200px",
          height: "200px",
          backgroundColor: "rgba(20, 16, 10, 0.65)",
          boxShadow:
            "0 0 60px rgba(212, 175, 55, 0.55), inset 0 0 30px rgba(212, 175, 55, 0.25)",
          border: "1.5px solid rgba(212, 175, 55, 0.4)",
        }}
      >
        <RingLoader
          color="#ffd700"
          loading={true}
          size={140}
          speedMultiplier={0.7}
        />
      </div>

      {message && (
        <p
          className="fw-bold text-center px-3"
          style={{
            color: "#f3e5ab",
            textShadow: "0 0 12px rgba(212, 175, 55, 0.8)",
            letterSpacing: "1.5px",
            fontSize: "1.05rem",
            fontFamily: "Georgia, serif",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Loader;
