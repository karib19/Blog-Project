import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("verify-otp/", {
        email,
        otp,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setMessage(
        error.response?.data?.error || "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.post("resend-otp/", {
        email,
      });

      setMessage(res.data.message);

    } catch (error) {
      setMessage(
        error.response?.data?.error || "Failed to resend OTP."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">

      <div className="bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-2">
          Verify Email
        </h1>

        <p className="text-gray-500 mb-6">
          OTP sent to
          <br />
          <strong>{email}</strong>
        </p>

        <form
          onSubmit={handleVerify}
          className="space-y-5"
        >

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border rounded-lg px-4 py-3"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <button
          onClick={handleResend}
          className="mt-5 w-full border py-3 rounded-lg hover:bg-gray-100"
        >
          Resend OTP
        </button>

        {message && (
          <p className="mt-5 text-center text-red-600">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default VerifyOTP;