// -----------------------------------------------------------------------------
// COMPONENTE CONTENEDOR DE PÁGINA (PAGE LAYOUT)
// -----------------------------------------------------------------------------
import "./PageLayout.css";

export default function PageLayout({ children }) {
  return (
    <div className="page-layout-wrapper">
      <main className="page-layout-content">{children}</main>
    </div>
  );
}
