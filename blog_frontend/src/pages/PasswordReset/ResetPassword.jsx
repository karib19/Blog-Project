import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("password-reset/confirm/", {
        token,
        new_password: newPassword,
      });

      setMessage(response.data.message || "Password reset successful.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.token?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.message ||
        "Invalid or expired link."
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
            Reset Password
          </h1>

          <p className="text-slate-500 mt-2">
            Choose a new password for your account.
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-800"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-800"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-800 text-white py-3 rounded-xl font-semibold hover:bg-rose-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
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

      </div>

    </div>
  );
}