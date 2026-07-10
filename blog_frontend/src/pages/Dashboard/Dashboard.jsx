import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../api/axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get("profile/")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    api
      .get("my-posts/")
      .then((response) => {
        setPosts(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDelete = async (slug) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`posts/${slug}/delete/`);

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.slug !== slug)
      );

      alert("Post Deleted Successfully");
    } catch (error) {
      console.error(error.response?.data);
      alert("Delete Failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-14 w-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const publishedPosts = posts.filter(
    (post) => post.status === "published"
  ).length;

  const draftPosts = posts.filter(
    (post) => post.status === "draft"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl text-white p-8 shadow-xl">

        <h1 className="text-4xl font-bold">
          Welcome back, {user.first_name || user.username} 👋
        </h1>

        <p className="mt-3 text-blue-100">
          {user.email}
        </p>

        <p className="mt-2 text-blue-200">
          Manage your blog posts, create new content and monitor your activity.
        </p>

      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-3">

        <div className="bg-white rounded-2xl shadow-lg p-6 border">

          <p className="text-gray-500 text-sm">
            Total Posts
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {posts.length}
          </h2>

        </div>

        <div className="bg-green-50 rounded-2xl shadow-lg p-6 border border-green-200">

          <p className="text-green-700 text-sm">
            Published
          </p>

          <h2 className="text-4xl font-bold mt-2 text-green-700">
            {publishedPosts}
          </h2>

        </div>

        <div className="bg-yellow-50 rounded-2xl shadow-lg p-6 border border-yellow-200">

          <p className="text-yellow-700 text-sm">
            Drafts
          </p>

          <h2 className="text-4xl font-bold mt-2 text-yellow-700">
            {draftPosts}
          </h2>

        </div>

      </div>

      <div className="flex justify-between items-center mt-10 mb-6">

        <h2 className="text-2xl font-bold text-gray-800">
          My Posts
        </h2>

        <NavLink
          to="/create-post"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          + Create New Post
        </NavLink>

      </div>

            {posts.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

          <div className="text-6xl mb-4">
            📝
          </div>

          <h3 className="text-2xl font-bold text-gray-800">
            No Posts Yet
          </h3>

          <p className="text-gray-500 mt-2">
            Start writing your first blog post.
          </p>

          <NavLink
            to="/create-post"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Create Your First Post
          </NavLink>

        </div>

      ) : (

        <div className="grid gap-6">

          {posts.map((post) => (

            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition p-6"
            >

              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">

                <div className="flex-1">

                  <h3 className="text-2xl font-bold text-gray-800">
                    {post.title}
                  </h3>

                  <div className="flex flex-wrap gap-3 mt-3">

                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      📂 {post.category?.name || "Uncategorized"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status === "published"
                        ? "✅ Published"
                        : "📝 Draft"}
                    </span>

                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      👁 {post.views} Views
                    </span>

                  </div>

                  <p className="text-gray-500 text-sm mt-4">
                    Created:
                    {" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>

                </div>

                <div className="flex gap-3">

                  <NavLink
                    to={`/posts/${post.slug}/edit`}
                    className="px-5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
                  >
                    ✏ Edit
                  </NavLink>

                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Dashboard;