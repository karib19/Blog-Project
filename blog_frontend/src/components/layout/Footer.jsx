import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import api from "../../api/axios";

function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("categories/")
      .then((response) => {
        setCategories(response.data.results || response.data);
      })
      .catch((error) => {
        console.error(error.response?.data);
      });
  }, []);

  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <h2
            className="text-2xl font-semibold text-white"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            <span className="italic">Blog</span>
            <span className="text-rose-400">Sphere</span>
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            BlogSphere is a home for stories worth reading — history,
            sports, politics, technology and everything in between,
            written by writers who care about their craft.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <NavLink
                to="/"
                className="transition hover:text-rose-400"
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/archive"
                className="transition hover:text-rose-400"
              >
                Archive
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/login"
                className="transition hover:text-rose-400"
              >
                Login
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/register"
                className="transition hover:text-rose-400"
              >
                Register
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard"
                className="transition hover:text-rose-400"
              >
                Dashboard
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Categories
          </h3>

          {categories.length === 0 ? (
            <p className="text-sm text-slate-500">
              No categories yet.
            </p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-400">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/?category=${category.id}`}
                    className="transition hover:text-rose-400"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Contact
          </h3>

          <p className="text-sm text-slate-400">
            Email
          </p>

          <a
            href="mailto:support@blogsphere.com"
            className="mt-1 block break-all text-sm text-slate-300 transition hover:text-rose-400"
          >
            support@blogsphere.com
          </a>

          {/* Social Buttons */}
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="#"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm transition hover:bg-rose-800 hover:text-white"
            >
              Facebook
            </a>

            <a
              href="#"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm transition hover:bg-rose-800 hover:text-white"
            >
              Twitter
            </a>

            <a
              href="#"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm transition hover:bg-rose-800 hover:text-white"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:px-6 md:flex-row md:text-left">

          <p className="text-sm text-slate-400">
            © 2026 BlogSphere. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <NavLink
              to="/privacy"
              className="transition hover:text-rose-400"
            >
              Privacy Policy
            </NavLink>

            <NavLink
              to="/terms"
              className="transition hover:text-rose-400"
            >
              Terms of Service
            </NavLink>

            <NavLink
              to="/cookies"
              className="transition hover:text-rose-400"
            >
              Cookies
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;