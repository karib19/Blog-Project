import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `transition duration-300 ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            BlogSphere
          </NavLink>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">

            <NavLink
              to="/"
              className={linkClass}
            >
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={linkClass}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/my-bookmarks"
                  className={linkClass}
                >
                  Bookmarks
                </NavLink>

                <NavLink
                  to="/profile"
                  className={linkClass}
                >
                  Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={linkClass}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>

          {/* Mobile Button */}
          <button
            className="md:hidden text-3xl"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden flex flex-col gap-4 pb-5">

            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/my-bookmarks"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Bookmarks
                </NavLink>

                <NavLink
                  to="/profile"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="rounded-lg bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;