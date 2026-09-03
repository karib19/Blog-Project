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

  const loadProfile = async () => {
    try {
      const response = await api.get("profile/");

      setFormData({
        username: response.data.username || "",
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || "",
        avatar: response.data.avatar || null,
      });

      setAvatarFile(null);

      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }

      setAvatarPreview(null);
    } catch (error) {
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const response = await api.get("profile/");

        if (cancelled) return;

        setFormData({
          username: response.data.username || "",
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          avatar: response.data.avatar || null,
        });

        setAvatarFile(null);

        if (avatarPreview) {
          URL.revokeObjectURL(avatarPreview);
        }

        setAvatarPreview(null);
      } catch (error) {
        console.error(error.response?.data || error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      cancelled = true;
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Optional validation
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setAvatarFile(file);
    setAvatarPreview(previewUrl);
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
      await api.put("profile/", data);

      alert("Profile Updated Successfully");

      await loadProfile();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Profile Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="h-14 w-14 border-4 border-rose-800 border-t-transparent rounded-full animate-spin dark:border-rose-400"></div>
      </div>
    );
  }

  const displayAvatar = avatarPreview || formData.avatar;

  const avatarLetter = formData.first_name
    ? formData.first_name.charAt(0).toUpperCase()
    : formData.username
      ? formData.username.charAt(0).toUpperCase()
      : "U";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">

      {/* =========================
          PROFILE HEADER
      ========================== */}
      <div className="w-full bg-linear-to-r from-rose-800 to-slate-800 rounded-3xl shadow-xl text-white p-5 sm:p-8 overflow-hidden">

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">

          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Avatar"
              className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full object-cover shadow-lg border-4 border-white"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full bg-white text-rose-800 flex items-center justify-center text-4xl font-bold shadow-lg">
              {avatarLetter}
            </div>
          )}

          <div className="min-w-0 text-center sm:text-left">
            <h1
              className="text-3xl sm:text-4xl font-semibold wrap-break-words"
              style={{ fontFamily: "var(--font-serif, serif)" }}
            >
              My Profile
            </h1>

            <p className="mt-2 text-rose-100 text-sm sm:text-base">
              Manage your account information.
            </p>
          </div>

        </div>
      </div>

      {/* =========================
          PROFILE FORM
      ========================== */}
      <div className="w-full mt-6 sm:mt-8 bg-white rounded-3xl shadow-lg border border-slate-100 p-5 sm:p-8 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">

        <form onSubmit={handleSubmit} className="space-y-6 min-w-0">

          {/* =========================
              PROFILE PICTURE
          ========================== */}
          <div className="min-w-0">

            <label className="block text-slate-700 font-semibold mb-3 dark:text-slate-200">
              Profile Picture
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0">

              {/* Avatar Preview */}
              <div className="shrink-0">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border border-slate-200 shadow-sm dark:border-slate-700"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-800 flex items-center justify-center text-2xl font-bold dark:bg-rose-950/40 dark:text-rose-400">
                    {avatarLetter}
                  </div>
                )}
              </div>

              {/* File Input */}
              <div className="w-full min-w-0">
                <input
                  type="file"
                  name="avatar"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleAvatarChange}
                  className="
                    block
                    w-full
                    min-w-0
                    max-w-full
                    box-border
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    p-2
                    text-sm
                    text-slate-700
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-slate-300
                    file:mr-3
                    file:rounded-lg
                    file:border-0
                    file:bg-rose-800
                    file:px-3
                    file:py-2
                    file:text-sm
                    file:font-medium
                    file:text-white
                    file:cursor-pointer
                    hover:file:bg-rose-900
                    dark:file:bg-rose-600
                    dark:hover:file:bg-rose-500
                  "
                />
              </div>

            </div>

            <p className="text-sm text-slate-500 mt-2 dark:text-slate-400">
              PNG or JPG recommended. Square images look best. Maximum 5MB.
            </p>

          </div>

          {/* =========================
              USERNAME
          ========================== */}
          <div className="min-w-0">

            <label className="block text-slate-700 font-semibold mb-2 dark:text-slate-200">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="
                block
                w-full
                min-w-0
                box-border
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
                bg-white
                text-slate-900
                focus:ring-2
                focus:ring-rose-800
                focus:outline-none
                dark:bg-slate-800
                dark:border-slate-700
                dark:text-white
              "
            />

          </div>

          {/* =========================
              FIRST + LAST NAME
          ========================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">

            <div className="min-w-0">

              <label className="block text-slate-700 font-semibold mb-2 dark:text-slate-200">
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="
                  block
                  w-full
                  min-w-0
                  box-border
                  border
                  border-slate-300
                  rounded-xl
                  px-4
                  py-3
                  bg-white
                  text-slate-900
                  focus:ring-2
                  focus:ring-rose-800
                  focus:outline-none
                  dark:bg-slate-800
                  dark:border-slate-700
                  dark:text-white
                "
              />

            </div>

            <div className="min-w-0">

              <label className="block text-slate-700 font-semibold mb-2 dark:text-slate-200">
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="
                  block
                  w-full
                  min-w-0
                  box-border
                  border
                  border-slate-300
                  rounded-xl
                  px-4
                  py-3
                  bg-white
                  text-slate-900
                  focus:ring-2
                  focus:ring-rose-800
                  focus:outline-none
                  dark:bg-slate-800
                  dark:border-slate-700
                  dark:text-white
                "
              />

            </div>

          </div>

          {/* =========================
              EMAIL
          ========================== */}
          <div className="min-w-0">

            <label className="block text-slate-700 font-semibold mb-2 dark:text-slate-200">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="
                block
                w-full
                min-w-0
                box-border
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
                bg-white
                text-slate-900
                focus:ring-2
                focus:ring-rose-800
                focus:outline-none
                dark:bg-slate-800
                dark:border-slate-700
                dark:text-white
              "
            />

          </div>

          {/* =========================
              ACTION BUTTONS
          ========================== */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">

            <button
              type="submit"
              disabled={saving}
              className={`
                w-full
                sm:flex-1
                min-w-0
                font-semibold
                py-3
                px-4
                rounded-xl
                transition
                duration-300
                shadow-md
                hover:shadow-lg
                text-white
                ${saving
                  ? "bg-slate-400 cursor-not-allowed dark:bg-slate-700"
                  : "bg-rose-800 hover:bg-rose-900 dark:bg-rose-600 dark:hover:bg-rose-500"
                }
              `}
            >
              {saving ? "Saving..." : "💾 Update Profile"}
            </button>

            <Link
              to="/change-password"
              className="
                w-full
                sm:flex-1
                min-w-0
                bg-slate-900
                hover:bg-black
                text-white
                font-semibold
                py-3
                px-4
                rounded-xl
                transition
                duration-300
                shadow-md
                hover:shadow-lg
                text-center
                dark:bg-white
                dark:text-slate-900
                dark:hover:bg-slate-200
              "
            >
              🔒 Change Password
            </Link>

          </div>

        </form>
      </div>

      {/* =========================
          ACCOUNT INFORMATION
      ========================== */}
      <div className="w-full mt-6 sm:mt-8 bg-rose-100 border border-rose-100 rounded-2xl p-5 sm:p-6 dark:bg-rose-950/20 dark:border-rose-900/40 overflow-hidden">

        <h2 className="text-xl font-bold text-slate-800 mb-4 dark:text-white">
          Account Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">

          <div className="min-w-0">
            <span className="font-semibold text-slate-900 dark:text-white">
              Username:
            </span>

            <p className="wrap-break-words">
              {formData.username || "Not set"}
            </p>
          </div>

          <div className="min-w-0">
            <span className="font-semibold text-slate-900 dark:text-white">
              Email:
            </span>

            <p className="wrap-break-words">
              {formData.email || "Not set"}
            </p>
          </div>

          <div className="min-w-0">
            <span className="font-semibold text-slate-900 dark:text-white">
              First Name:
            </span>

            <p className="wrap-break-words">
              {formData.first_name || "Not set"}
            </p>
          </div>

          <div className="min-w-0">
            <span className="font-semibold text-slate-900 dark:text-white">
              Last Name:
            </span>

            <p className="wrap-break-words">
              {formData.last_name || "Not set"}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;