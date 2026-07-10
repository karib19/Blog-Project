import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function ChangePassword() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const passwordsMatch =
    formData.new_password ===
    formData.confirm_password;

  const passwordStrength = () => {
    const password = formData.new_password;

    if (password.length < 8) return "Weak";

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial =
      /[@$!%*?&]/.test(password);

    const score = [
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length;

    if (score <= 1) return "Weak";
    if (score <= 3) return "Medium";

    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.put("change-password/", formData);

      alert(
        "Password changed successfully. Please login again."
      );

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");

      navigate("/login");
    } catch (error) {
      console.error(error.response?.data);
      alert("Password change failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <div className="bg-linear-to-r from-red-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">

        <h1 className="text-4xl font-bold">
          Change Password
        </h1>

        <p className="mt-3 text-red-100">
          Keep your account secure by using a strong password.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-white rounded-3xl shadow-lg border p-8 space-y-6"
      >

        <div>

          <label className="block font-semibold mb-2">
            Current Password
          </label>

           <div className="relative">

              <input
                type={showOldPassword ? "text" : "password"}
                name="old_password"
                placeholder="Enter password"
                value={formData.old_password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
              >
                {showOldPassword ? "Hide" : "Show"}
              </button>

            </div>

        </div>

        <div>

          <label className="block font-semibold mb-2">
            New Password
          </label>

          <div className="relative">

            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              name="new_password"
              placeholder="New Password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>

          </div>

          <p className="mt-2 text-sm">
            Password Strength:
            <span
              className={`ml-2 font-semibold ${
                passwordStrength() === "Strong"
                  ? "text-green-600"
                  : passwordStrength() === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {passwordStrength()}
            </span>
          </p>

        </div>

        <div>

          <label className="block font-semibold mb-2">
            Confirm New Password
          </label>

          <div className="relative">

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>

          </div>

          {formData.confirm_password && (
            <p
              className={`mt-2 text-sm font-medium ${
                passwordsMatch
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordsMatch
                ? "✅ Passwords match"
                : "❌ Passwords do not match"}
            </p>
          )}

          <div className="pt-4">

            <button
              type="submit"
              disabled={
                loading ||
                !passwordsMatch ||
                passwordStrength() === "Weak"
              }
              className={`w-full py-3 rounded-xl font-semibold text-white transition duration-300 ${
                loading ||
                !passwordsMatch ||
                passwordStrength() === "Weak"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">

                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-20"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-100"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>

                  </svg>

                  Updating Password...

                </span>
              ) : (
                "🔒 Change Password"
              )}
            </button>

          </div>

        </div>

      </form>

      <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Security Tips
        </h2>

        <ul className="space-y-2 text-gray-700 list-disc list-inside">

          <li>
            Use at least <strong>8 characters</strong>.
          </li>

          <li>
            Mix uppercase, lowercase, numbers and symbols.
          </li>

          <li>
            Never reuse passwords from other websites.
          </li>

          <li>
            After changing your password you'll need to login again.
          </li>

        </ul>

      </div>

    </div>
  );
}

export default ChangePassword;