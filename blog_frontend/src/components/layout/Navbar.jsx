import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";

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
    `text-sm font-medium tracking-wide transition duration-200 ${
      isActive
        ? "text-rose-800 dark:text-rose-400"
        : "text-slate-600 hover:text-rose-800 dark:text-slate-300 dark:hover:text-rose-400"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2.5 text-sm font-medium transition duration-200 ${
      isActive
        ? "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
        : "text-slate-600 hover:bg-slate-50 hover:text-rose-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-400"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* ================= Logo ================= */}
          <NavLink
            to="/"
            onClick={closeMenu}
            className="flex items-baseline "
          >
            <span
              className="text-[22px] font-semibold italic tracking-tight text-slate-900 dark:text-white"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Blog
            </span>
            <span className="text-[22px] font-semibold tracking-tight text-rose-800 dark:text-rose-400">
            Sphere
            </span>
          </NavLink>

          {/* ================= Desktop Menu ================= */}
          <nav className="hidden items-center gap-6 md:flex">

            <div className="flex items-center gap-1 border-r border-slate-200 pr-5 dark:border-slate-800">
              <ThemeToggle />
              {isAuthenticated && <NotificationBell />}
            </div>

            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/my-bookmarks" className={linkClass}>
                  Bookmarks
                </NavLink>

                <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-rose-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-rose-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="rounded-full bg-rose-800 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-rose-900 active:scale-95 dark:bg-rose-600 dark:hover:bg-rose-500"
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>

          {/* ================= Mobile Actions ================= */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            {isAuthenticated && <NotificationBell />}

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-700 transition duration-200 hover:bg-slate-100 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* ================= Mobile Menu ================= */}
        {menuOpen && (
          <nav className="border-t border-slate-100 py-4 md:hidden dark:border-slate-800">
            <div className="flex flex-col gap-1">

              <NavLink to="/" className={mobileLinkClass} onClick={closeMenu}>
                Home
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" className={mobileLinkClass} onClick={closeMenu}>
                    Dashboard
                  </NavLink>

                  <NavLink to="/my-bookmarks" className={mobileLinkClass} onClick={closeMenu}>
                    Bookmarks
                  </NavLink>

                  <NavLink to="/profile" className={mobileLinkClass} onClick={closeMenu}>
                    Profile
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-lg bg-slate-900 px-3 py-2.5 text-left text-sm font-medium text-white transition duration-200 hover:bg-rose-800 dark:bg-white dark:text-slate-900 dark:hover:bg-rose-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={mobileLinkClass} onClick={closeMenu}>
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    className="mt-2 rounded-lg bg-rose-800 px-3 py-2.5 text-center text-sm font-medium text-white transition duration-200 hover:bg-rose-900 dark:bg-rose-600 dark:hover:bg-rose-500"
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