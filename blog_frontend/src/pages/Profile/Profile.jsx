import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    avatar: null,
  });

  const loadProfile = () => {
    api
      .get("profile/")
      .then((response) => {
        setFormData({
          username: response.data.username || "",
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          avatar: response.data.avatar || null,
        });

        setAvatarFile(null);
        setAvatarPreview(null);

        setLoading(false);
      })
      .catch((error) => {
        console.error(error.response?.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    const data = new FormData();

    data.append("username", formData.username);
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("email", formData.email);

    if (avatarFile) {
      data.append("avatar_upload", avatarFile);
    }

    try {
      await api.put("profile/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile Updated Successfully");

      loadProfile();
    } catch (error) {
      console.error(error.response?.data);
      alert("Profile Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-14 w-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const displayAvatar = avatarPreview || formData.avatar;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-xl text-white p-8">

        <div className="flex flex-col md:flex-row items-center gap-6">

          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white text-blue-700 flex items-center justify-center text-4xl font-bold shadow-lg">
              {formData.first_name
                ? formData.first_name.charAt(0).toUpperCase()
                : formData.username.charAt(0).toUpperCase()}
            </div>
          )}

          <div>

            <h1 className="text-4xl font-bold">
              My Profile
            </h1>

            <p className="mt-2 text-blue-100">
              Manage your account information.
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8 bg-white rounded-3xl shadow-lg border p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Profile Picture
            </label>

            <div className="flex items-center gap-5">

              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover border shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                  {formData.first_name
                    ? formData.first_name.charAt(0).toUpperCase()
                    : formData.username.charAt(0).toUpperCase()}
                </div>
              )}

              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block flex-1 rounded-xl border border-gray-300 p-2.5 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer file:mr-4"
              />

            </div>

            <p className="text-sm text-gray-500 mt-2">
              PNG or JPG recommended. Square images look best.
            </p>

          </div>

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block text-gray-700 font-semibold mb-2">
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="block text-gray-700 font-semibold mb-2">
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

            </div>

          </div>

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">

            <button
              type="submit"
              disabled={saving}
              className={`flex-1 font-semibold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg text-white ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving..." : "💾 Update Profile"}
            </button>

            <Link
              to="/change-password"
              className="flex-1"
            >
              <button
                type="button"
                className="w-full bg-gray-800 hover:bg-black text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
              >
                🔒 Change Password
              </button>
            </Link>

          </div>

        </form>

      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Account Information
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 text-gray-700">

          <div>
            <span className="font-semibold">
              Username:
            </span>
            <p>{formData.username}</p>
          </div>

          <div>
            <span className="font-semibold">
              Email:
            </span>
            <p>{formData.email}</p>
          </div>

          <div>
            <span className="font-semibold">
              First Name:
            </span>
            <p>{formData.first_name || "Not set"}</p>
          </div>

          <div>
            <span className="font-semibold">
              Last Name:
            </span>
            <p>{formData.last_name || "Not set"}</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;