import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("password-reset/request/", { email });
      setMessage(response.data.message || "Reset link sent to your email.");
    } catch (err) {
      setError(
        err.response?.data?.email?.[0] ||
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-900 via-rose-950 to-slate-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-6">

          <h1
            className="text-3xl font-semibold text-slate-900"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            Forgot Password
          </h1>

          <p className="text-slate-500 mt-2">
            Enter your email and we'll send you a link to reset your password.
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-800"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-800 text-white py-3 rounded-xl font-semibold hover:bg-rose-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {message && (
          <p className="text-emerald-600 mt-4 text-center font-medium">
            {message}
          </p>
        )}

        {error && (
          <p className="text-rose-600 mt-4 text-center font-medium">
            {error}
          </p>
        )}

        <div className="mt-8 text-center border-t border-slate-100 pt-6">

          <Link
            to="/login"
            className="font-semibold text-rose-800 hover:text-rose-900 hover:underline"
          >
            ← Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}