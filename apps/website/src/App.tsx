import { Link, Outlet, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, Arial", padding: 16 }}>
      <header style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link
          to="/"
          style={{ fontWeight: location.pathname === "/" ? 700 : 400 }}
        >
          Home
        </Link>
        <Link
          to="/customers"
          style={{
            fontWeight: location.pathname.startsWith("/customers") ? 700 : 400,
          }}
        >
          Clientes
        </Link>
        <Link
          to="/selected"
          style={{
            fontWeight: location.pathname.startsWith("/selected") ? 700 : 400,
          }}
        >
          Selecionados
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
