import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setErrors({});

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const passwordsMatch =
    formData.password === formData.confirm_password;

  const passwordStrength = () => {
    const password = formData.password;

    if (password.length < 8) return "Weak";

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

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

    setErrors({});

    if (!passwordsMatch) {
      alert("Passwords do not match.");
      return;
    }

    if (passwordStrength() === "Weak") {
      alert("Choose a stronger password.");
      return;
    }

    setLoading(true);

    try {
      await api.post("register/", {
    username: formData.username,
    first_name: formData.first_name,
    last_name: formData.last_name,
    email: formData.email,
    password: formData.password,
});

  navigate("/verify-otp", {
    state: {
      email: formData.email,
  },
});
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }

      console.error(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            Create Account 🚀
          </h1>

          <p className="text-gray-500 mt-2">
            Join our blog community today
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="block mb-2 font-medium text-gray-700">
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.first_name[0]}
                </p>
              )}

            </div>

            <div>

              <label className="block mb-2 font-medium text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.last_name[0]}
                </p>
              )}

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username[0]}
              </p>
            )}

          </div>

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email[0]}
              </p>
            )}

          </div>

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-medium hover:text-blue-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password[0]}
              </p>
            )}

            <div className="mt-3 flex items-center gap-3">

              <span className="text-sm font-medium">
                Password Strength:
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  passwordStrength() === "Strong"
                    ? "bg-green-100 text-green-700"
                    : passwordStrength() === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {passwordStrength()}
              </span>

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirm_password"
                placeholder="Confirm your password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-medium hover:text-blue-800"
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

          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !passwordsMatch ||
              passwordStrength() === "Weak"
            }
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              loading ||
              !passwordsMatch ||
              passwordStrength() === "Weak"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="mt-8 text-center border-t pt-6">

          <p className="text-gray-600">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="inline-block mt-2 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign In
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;