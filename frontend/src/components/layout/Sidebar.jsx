import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-700 hover:bg-slate-200"
    }`;

  return (
    <aside className="w-full rounded-2xl bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72 lg:flex-shrink-0">
      <div className="flex h-full flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Team Task</h2>
          <p className="text-sm text-slate-500">Panel de gestión</p>
        </div>

        <nav className="space-y-2">
          <NavLink to="/users" className={linkClass}>
            Usuarios
          </NavLink>
          <NavLink to="/tasks" className={linkClass}>
            Tareas
          </NavLink>
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-500"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;