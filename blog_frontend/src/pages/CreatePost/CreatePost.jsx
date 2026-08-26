import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../../api/axios";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
};

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
    meta_description: "",
    status: "draft",
    published_at: "",
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

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const data = new FormData();

    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("content", formData.content);
    data.append("meta_description", formData.meta_description);
    data.append("status", formData.status);

    if (formData.status === "scheduled" && formData.published_at) {
      data.append("published_at", formData.published_at);
    }

    formData.tags.forEach((tag) => {
      data.append("tags", tag);
    });

    if (formData.featured_image) {
      data.append(
        "featured_image",
        formData.featured_image
      );
    }

    try {
      const response = await api.post(
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
        meta_description: "",
        status: "draft",
        published_at: "",
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

      <div className="bg-linear-to-r from-rose-800 via-rose-900 to-slate-800 rounded-3xl p-8 shadow-xl text-white mb-8">

        <h1
          className="text-4xl font-semibold"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          ✍️ Create New Post
        </h1>

        <p className="mt-3 text-rose-100 text-lg">
          Share your knowledge with the world.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-7 dark:bg-slate-900 dark:border-slate-800"
      >

        <div>

          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Post Title
          </label>

          <input
            type="text"
            name="title"
            placeholder="Enter an attractive title..."
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-900 focus:ring-2 focus:ring-rose-800 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
          />

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-900 focus:ring-2 focus:ring-rose-800 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
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

            <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
              Tags
            </label>

            <select
              multiple
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full h-36 rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-900 focus:ring-2 focus:ring-rose-800 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
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

            <p className="text-sm text-slate-500 mt-2 dark:text-slate-400">
              Hold Ctrl (Windows) or Cmd (Mac) to
              select multiple tags.
            </p>

          </div>

        </div>

        <div>

          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Featured Image
          </label>

          <input
            type="file"
            name="featured_image"
            accept="image/*"
            onChange={handleChange}
            className="block w-full rounded-xl border border-slate-300 p-3 text-slate-700 file:bg-rose-800 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer dark:border-slate-700 dark:text-slate-300 dark:file:bg-rose-600"
          />

          {imagePreview && (

            <div className="mt-5">

              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-2xl w-full md:w-96 h-60 object-cover shadow-md border border-slate-200 dark:border-slate-700"
              />

            </div>

          )}

        </div>

        <div>

          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Content
          </label>

          <div
            className="rounded-2xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-rose-800 dark:border-slate-700
            [&_.ql-toolbar]:dark:bg-slate-800 [&_.ql-toolbar]:dark:border-slate-700
            [&_.ql-container]:dark:bg-slate-800 [&_.ql-container]:dark:border-slate-700
            [&_.ql-editor]:dark:text-slate-100 [&_.ql-editor.ql-blank::before]:dark:text-slate-500
            [&_.ql-stroke]:dark:stroke-slate-300 [&_.ql-fill]:dark:fill-slate-300
            [&_.ql-picker-label]:dark:text-slate-300"
          >
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              placeholder="Write your article here..."
              className="bg-white dark:bg-slate-800 [&_.ql-container]:min-h-70 [&_.ql-container]:text-base"
            />
          </div>

        </div>

        <div>

          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Meta Description (SEO)
          </label>

          <textarea
            name="meta_description"
            rows="2"
            maxLength={160}
            placeholder="Short summary shown in Google search results..."
            value={formData.meta_description}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none bg-white text-slate-900 focus:ring-2 focus:ring-rose-800 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
          />

          <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
            {formData.meta_description.length}/160 characters
          </p>

        </div>

        <div>

          <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Publish Status
          </label>

          <div className="grid sm:grid-cols-3 gap-3">

            {[
              { value: "draft", label: "📝 Save as Draft" },
              { value: "published", label: "🚀 Publish Now" },
              { value: "scheduled", label: "🕒 Schedule" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, status: option.value }))
                }
                className={`py-3 px-4 rounded-xl font-medium text-sm border transition ${
                  formData.status === option.value
                    ? "bg-rose-800 text-white border-rose-800 dark:bg-rose-600 dark:border-rose-600"
                    : "bg-white text-slate-700 border-slate-300 hover:border-rose-800 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}

          </div>

          {formData.status === "scheduled" && (
            <div className="mt-4">

              <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-200">
                Publish Date & Time
              </label>

              <input
                type="datetime-local"
                name="published_at"
                value={formData.published_at}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-900 focus:ring-2 focus:ring-rose-800 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />

              <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
                Your post will automatically go live at this date and time.
              </p>

            </div>
          )}

        </div>

        <div className="flex flex-col md:flex-row gap-4">

          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-slate-400 cursor-not-allowed dark:bg-slate-700"
                : "bg-rose-800 hover:bg-rose-900 dark:bg-rose-600 dark:hover:bg-rose-500"
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

      <div className="mt-8 bg-rose-100 border border-rose-100 rounded-2xl p-6 dark:bg-rose-950/20 dark:border-rose-900/40">

        <h2 className="text-xl font-bold text-slate-800 mb-3 dark:text-white">
          Writing Tips
        </h2>

        <ul className="space-y-2 text-slate-700 list-disc list-inside dark:text-slate-300">

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