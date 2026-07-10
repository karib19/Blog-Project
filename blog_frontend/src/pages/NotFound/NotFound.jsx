import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">

      <div className="max-w-2xl w-full text-center">

        <div className="text-8xl md:text-9xl font-black text-gray-200">
          404
        </div>

        <h1 className="mt-4 text-4xl font-bold text-gray-800">
          Oops! Page Not Found
        </h1>

        <p className="mt-4 text-lg text-gray-500">
          The page you're looking for doesn't exist,
          has been moved, or the URL may be incorrect.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
          >
            🏠 Back to Home
          </Link>

          <Link
            to="/dashboard"
            className="px-6 py-3 border border-gray-300 hover:bg-gray-100 rounded-xl font-semibold transition"
          >
            Dashboard
          </Link>

        </div>

        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-6">

          <p className="text-gray-600">
            <span className="font-semibold">
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