import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [previewImage, setPreviewImage] =
    useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: [],
    content: "",
    featured_image: null,
  });

  useEffect(() => {
    loadCategories();
    loadTags();
    loadPost();
  }, [slug]);

  const loadCategories = async () => {
    try {
      const response = await api.get(
        "categories/"
      );

      setCategories(
        response.data.results || response.data
      );
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  const loadTags = async () => {
    try {
      const response = await api.get("tags/");

      setTags(
        response.data.results || response.data
      );
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  const loadPost = async () => {
    try {
      const response = await api.get(
        `posts/${slug}/`
      );

      setFormData({
        title: response.data.title,
        category:
          response.data.category?.id || "",
        tags: response.data.tags.map((tag) =>
          String(tag.id)
        ),
        content: response.data.content,
        featured_image: null,
      });

      setPreviewImage(
        response.data.featured_image
      );
    } catch (error) {
      console.error(error.response?.data);
    }
  };

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
        setPreviewImage(
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

    try {      await api.put(
        `posts/${slug}/update/`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Post Updated Successfully");

      navigate("/dashboard");

    } catch (error) {
      console.error(error.response?.data);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-8 shadow-xl text-white mb-8">

        <h1 className="text-4xl font-bold">
          ✏️ Edit Your Post
        </h1>

        <p className="mt-3 text-orange-100 text-lg">
          Update your article and keep it fresh.
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
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
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
              className="w-full h-36 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
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

          </div>

        </div>

        <div>

          <label className="block font-semibold mb-2">
            Featured Image
          </label>

          {previewImage && (

            <img
              src={previewImage}
              alt="Preview"
              className="w-full md:w-96 h-60 object-cover rounded-2xl border shadow-md mb-4"
            />

          )}

          <input
            type="file"
            name="featured_image"
            accept="image/*"
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-300 p-3 file:bg-orange-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
          />

        </div>

        <div>

          <label className="block font-semibold mb-2">
            Content
          </label>

          <textarea
            name="content"
            rows="12"
            value={formData.content}
            onChange={handleChange}
            placeholder="Update your article..."
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-4 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
          />

        </div>

        <div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-orange-600 hover:bg-orange-700 text-white"
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

                Updating Post...

              </span>

            ) : (
              "💾 Update Post"
            )}

          </button>

        </div>

      </form>

      <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Editing Tips
        </h2>

        <ul className="space-y-2 text-gray-700 list-disc list-inside">

          <li>Keep the title short and descriptive.</li>

          <li>Update outdated information before publishing.</li>

          <li>Add or remove tags if needed.</li>

          <li>Replace the featured image for better engagement.</li>

          <li>Review grammar and formatting before saving.</li>

        </ul>

      </div>

    </div>
  );
}

export default EditPost;