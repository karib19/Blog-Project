import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

function VerifyOTP() {

  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    localStorage.getItem("verify_email") ||
    "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const res = await api.post("verify-otp/", {
        email,
        otp,
      });

      setIsError(false);
      setMessage(res.data.message);

      localStorage.removeItem("verify_email");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      setIsError(true);
      setMessage(
        error.response?.data?.error ||
        "Verification failed."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {

    setResending(true);
    setMessage("");

    try {

      const res = await api.post("resend-otp/", {
        email,
      });

      setIsError(false);
      setMessage(res.data.message);

    } catch (error) {

      setIsError(true);
      setMessage(
        error.response?.data?.error ||
        "Failed to resend OTP."
      );

    } finally {
      setResending(false);
    }
  };

  return (

    <div className="min-h-screen bg-linear-to-br from-rose-900 via-rose-950 to-slate-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-6">

          <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-3xl mb-4">
            ✉️
          </div>

          <h1
            className="text-3xl font-semibold text-slate-900"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            Verify Email
          </h1>

          <p className="text-slate-500 mt-2">
            We sent a 6-digit code to
            <br />
            <strong className="text-slate-800">{email}</strong>
          </p>

        </div>

        <form
          onSubmit={handleVerify}
          className="space-y-5"
        >

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="••••••"
            className="w-full border border-slate-300 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-800"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-rose-800 hover:bg-rose-900"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <button
          onClick={handleResend}
          disabled={resending}
          className="mt-4 w-full border border-slate-300 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>

        {message && (
          <p
            className={`mt-5 text-center font-medium ${
              isError ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {message}
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

export default VerifyOTP;