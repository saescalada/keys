import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "../../services/authApi";

function Sidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-key-fill"></i>
        <span>Keys</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <i className="bi bi-grid-1x2-fill"></i>
          Tablero
        </NavLink>

        <NavLink
          to="/admin/historial"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <i className="bi bi-clock-history"></i>
          Historial
        </NavLink>

        <NavLink
          to="/admin/personal"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <i className="bi bi-people-fill"></i>
          Personal
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
