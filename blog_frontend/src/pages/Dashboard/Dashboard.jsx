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
        <div className="h-14 w-14 border-4 border-rose-800 border-t-transparent rounded-full animate-spin dark:border-rose-400"></div>
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

      <div className="bg-linear-to-r from-rose-800 to-slate-800 rounded-3xl text-white p-8 shadow-xl">

        <h1
          className="text-4xl font-semibold"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          Welcome back, {user.first_name || user.username} 👋
        </h1>

        <p className="mt-3 text-rose-100">
          {user.email}
        </p>

        <p className="mt-2 text-rose-200">
          Manage your blog posts, create new content and monitor your activity.
        </p>

      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-3">

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">

          <p className="text-slate-500 text-sm dark:text-slate-400">
            Total Posts
          </p>

          <h2 className="text-4xl font-bold mt-2 text-slate-900 dark:text-white">
            {posts.length}
          </h2>

        </div>

        <div className="bg-emerald-50 rounded-2xl shadow-lg p-6 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40">

          <p className="text-emerald-700 text-sm dark:text-emerald-400">
            Published
          </p>

          <h2 className="text-4xl font-bold mt-2 text-emerald-700 dark:text-emerald-400">
            {publishedPosts}
          </h2>

        </div>

        <div className="bg-amber-50 rounded-2xl shadow-lg p-6 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40">

          <p className="text-amber-700 text-sm dark:text-amber-400">
            Drafts
          </p>

          <h2 className="text-4xl font-bold mt-2 text-amber-700 dark:text-amber-400">
            {draftPosts}
          </h2>

        </div>

      </div>

      <div className="flex justify-between items-center mt-10 mb-6">

        <h2
          className="text-2xl font-semibold text-slate-900 dark:text-white"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          My Posts
        </h2>

        <NavLink
          to="/create-post"
          className="bg-rose-800 hover:bg-rose-900 text-white px-6 py-3 rounded-xl font-semibold transition dark:bg-rose-600 dark:hover:bg-rose-500"
        >
          + Create New Post
        </NavLink>

      </div>

            {posts.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-lg p-12 text-center dark:bg-slate-900 dark:border dark:border-slate-800">

          <div className="text-6xl mb-4">
            📝
          </div>

          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
            No Posts Yet
          </h3>

          <p className="text-slate-500 mt-2 dark:text-slate-400">
            Start writing your first blog post.
          </p>

          <NavLink
            to="/create-post"
            className="inline-block mt-6 bg-rose-800 hover:bg-rose-900 text-white px-6 py-3 rounded-xl font-semibold transition dark:bg-rose-600 dark:hover:bg-rose-500"
          >
            Create Your First Post
          </NavLink>

        </div>

      ) : (

        <div className="grid gap-6">

          {posts.map((post) => (

            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition p-6 dark:bg-slate-900 dark:border-slate-800"
            >

              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">

                <div className="flex-1">

                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {post.title}
                  </h3>

                  <div className="flex flex-wrap gap-3 mt-3">

                    <span className="px-3 py-1 bg-rose-50 text-rose-800 rounded-full text-sm font-medium dark:bg-rose-950/40 dark:text-rose-400">
                      📂 {post.category?.name || "Uncategorized"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.status === "published"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                      }`}
                    >
                      {post.status === "published"
                        ? "✅ Published"
                        : "📝 Draft"}
                    </span>

                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm dark:bg-slate-800 dark:text-slate-300">
                      👁 {post.views} Views
                    </span>

                  </div>

                  <p className="text-slate-500 text-sm mt-4 dark:text-slate-400">
                    Created:
                    {" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>

                </div>

                <div className="flex gap-3">

                  <NavLink
                    to={`/posts/${post.slug}/edit`}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition"
                  >
                    ✏ Edit
                  </NavLink>

                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="px-5 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-semibold transition dark:bg-rose-600 dark:hover:bg-rose-500"
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