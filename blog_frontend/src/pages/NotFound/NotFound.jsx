import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">

      <div className="max-w-2xl w-full text-center">

        <div
          className="text-8xl md:text-9xl font-black text-slate-200 dark:text-slate-800"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          404
        </div>

        <h1
          className="mt-4 text-4xl font-semibold text-slate-800 dark:text-white"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          Oops! Page Not Found
        </h1>

        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist,
          has been moved, or the URL may be incorrect.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/"
            className="px-6 py-3 bg-rose-800 hover:bg-rose-900 text-white rounded-xl font-semibold transition dark:bg-rose-600 dark:hover:bg-rose-500"
          >
            🏠 Back to Home
          </Link>

          <Link
            to="/dashboard"
            className="px-6 py-3 border border-slate-300 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 transition dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Dashboard
          </Link>

        </div>

        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800">

          <p className="text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">
              Need help?
            </span>{" "}
            Browse the latest articles from the homepage or
            return to your dashboard.
          </p>

        </div>

      </div>

    </div>
  );
}

export default NotFound;