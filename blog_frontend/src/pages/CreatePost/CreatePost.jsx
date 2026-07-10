import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function CreatePost() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [imagePreview, setImagePreview] =
    useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: [],
    content: "",
    featured_image: null,
  });

  useEffect(() => {
    api
      .get("categories/")
      .then((response) => {
        setCategories(
          response.data.results || response.data
        );
      })
      .catch((error) => {
        console.error(error.response?.data);
      });

    api
      .get("tags/")
      .then((response) => {
        setTags(
          response.data.results || response.data
        );
      })
      .catch((error) => {
        console.error(error.response?.data);
      });
  }, []);

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
      options,
    } = e.target;

    if (files) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        featured_image: file,
      }));

      if (file) {
        setImagePreview(
          URL.createObjectURL(file)
        );
      }

      return;
    }

    if (name === "tags") {
      const selectedTags = Array.from(
        options
      )
        .filter((option) => option.selected)
        .map((option) => option.value);

      setFormData((prev) => ({
        ...prev,
        tags: selectedTags,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const data = new FormData();

    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("content", formData.content);

    formData.tags.forEach((tag) => {
      data.append("tags", tag);
    });

    if (formData.featured_image) {
      data.append(
        "featured_image",
        formData.featured_image
      );
    }

    try {      const response = await api.post(
        "posts/create/",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      alert("Post Created Successfully!");

      setFormData({
        title: "",
        category: "",
        tags: [],
        content: "",
        featured_image: null,
      });

      setImagePreview(null);

      navigate("/dashboard");

    } catch (error) {
      console.error(error.response?.data);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 shadow-xl text-white mb-8">

        <h1 className="text-4xl font-bold">
          ✍️ Create New Post
        </h1>

        <p className="mt-3 text-blue-100 text-lg">
          Share your knowledge with the world.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 space-y-7"
      >

        <div>

          <label className="block font-semibold mb-2">
            Post Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Enter an attractive title..."
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block font-semibold mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}

            </select>

          </div>

          <div>

            <label className="block font-semibold mb-2">
              Tags
            </label>

            <select
              multiple
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full h-36 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {tags.map((tag) => (
                <option
                  key={tag.id}
                  value={tag.id}
                >
                  {tag.name}
                </option>
              ))}
            </select>

            <p className="text-sm text-gray-500 mt-2">
              Hold Ctrl (Windows) or Cmd (Mac) to
              select multiple tags.
            </p>

          </div>

        </div>

        <div>

          <label className="block font-semibold mb-2">
            Featured Image
          </label>

          <input
            type="file"
            name="featured_image"
            accept="image/*"
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-300 p-3 file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
          />

          {imagePreview && (

            <div className="mt-5">

              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-2xl w-full md:w-96 h-60 object-cover shadow-md border"
              />

            </div>

          )}

        </div>

        <div>

          <label className="block font-semibold mb-2">
            Content
          </label>

          <textarea
            name="content"
            rows="12"
            placeholder="Write your article here..."
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-gray-300 px-4 py-4 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

        <div className="flex flex-col md:flex-row gap-4">

          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {loading ? (

              <span className="flex items-center justify-center gap-3">

                <svg
                  className="animate-spin h-5 w-5"
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
                  />

                  <path
                    className="opacity-100"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />

                </svg>

                Publishing...

              </span>

            ) : (
              "🚀 Publish Post"
            )}

          </button>

        </div>

      </form>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Writing Tips
        </h2>

        <ul className="space-y-2 text-gray-700 list-disc list-inside">

          <li>Create a short, clear and attractive title.</li>

          <li>Choose the correct category for better organization.</li>

          <li>Add relevant tags so readers can discover your post.</li>

          <li>Use a high-quality featured image.</li>

          <li>Proofread before publishing.</li>

        </ul>

      </div>

    </div>
  );
}

export default CreatePost;