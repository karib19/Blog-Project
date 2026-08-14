import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `transition duration-200 ${
      isActive
        ? "font-semibold text-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* ================= Logo ================= */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className="text-2xl font-bold tracking-tight text-blue-600"
          >
            BlogSphere
          </NavLink>

          {/* ================= Desktop Menu ================= */}
          <nav className="hidden items-center gap-6 md:flex">

            {/* Notification */}
            {isAuthenticated && <NotificationBell />}

            {/* Home */}
            <NavLink
              to="/"
              className={linkClass}
            >
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                {/* Dashboard */}
                <NavLink
                  to="/dashboard"
                  className={linkClass}
                >
                  Dashboard
                </NavLink>

                {/* Bookmarks */}
                <NavLink
                  to="/my-bookmarks"
                  className={linkClass}
                >
                  Bookmarks
                </NavLink>

                {/* Profile */}
                <NavLink
                  to="/profile"
                  className={linkClass}
                >
                  Profile
                </NavLink>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-red-600 active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <NavLink
                  to="/login"
                  className={linkClass}
                >
                  Login
                </NavLink>

                {/* Register */}
                <NavLink
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-blue-700 active:scale-95"
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>

          {/* ================= Mobile Actions ================= */}
          <div className="flex items-center gap-2 md:hidden">

            {/* Notification */}
            {isAuthenticated && <NotificationBell />}

            {/* Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-gray-700 transition duration-200 hover:bg-gray-100 active:scale-95"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* ================= Mobile Menu ================= */}
        {menuOpen && (
          <nav className="border-t border-gray-100 py-4 md:hidden">

            <div className="flex flex-col gap-1">

              {/* Home */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 transition duration-200 ${
                    isActive
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
                onClick={closeMenu}
              >
                Home
              </NavLink>

              {isAuthenticated ? (
                <>
                  {/* Dashboard */}
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 transition duration-200 ${
                        isActive
                          ? "bg-blue-50 font-semibold text-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Dashboard
                  </NavLink>

                  {/* Bookmarks */}
                  <NavLink
                    to="/my-bookmarks"
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 transition duration-200 ${
                        isActive
                          ? "bg-blue-50 font-semibold text-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Bookmarks
                  </NavLink>

                  {/* Profile */}
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 transition duration-200 ${
                        isActive
                          ? "bg-blue-50 font-semibold text-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Profile
                  </NavLink>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-lg bg-red-500 px-3 py-2.5 text-left font-medium text-white transition duration-200 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login */}
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2.5 transition duration-200 ${
                        isActive
                          ? "bg-blue-50 font-semibold text-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Login
                  </NavLink>

                  {/* Register */}
                  <NavLink
                    to="/register"
                    className="mt-2 rounded-lg bg-blue-600 px-3 py-2.5 text-center font-medium text-white transition duration-200 hover:bg-blue-700"
                    onClick={closeMenu}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;