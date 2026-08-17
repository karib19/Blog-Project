import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function MyBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const response = await api.get(
        "my-bookmarks/"
      );

      setBookmarks(
        response.data.results || response.data
      );
    } catch (error) {
      console.error(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">

        <div className="text-center">

          <div className="h-12 w-12 border-4 border-rose-800 border-t-transparent rounded-full animate-spin mx-auto dark:border-rose-400"></div>

          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Loading bookmarks...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="bg-linear-to-r from-rose-800 to-slate-800 rounded-3xl shadow-xl p-8 text-white mb-10">

        <h1
          className="text-4xl font-semibold"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          🔖 My Bookmarks
        </h1>

        <p className="mt-3 text-rose-100 text-lg">
          Your saved articles in one place.
        </p>

      </div>

      {bookmarks.length === 0 ? (        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-12 text-center dark:bg-slate-900 dark:border-slate-800">

          <div className="text-6xl mb-4">
            📑
          </div>

          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            No Bookmarks Yet
          </h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Start saving your favorite articles and they'll appear here.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-rose-800 hover:bg-rose-900 text-white px-6 py-3 rounded-xl font-semibold transition dark:bg-rose-600 dark:hover:bg-rose-500"
          >
            Explore Posts
          </Link>

        </div>
      ) : (

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {bookmarks.map((bookmark) => (

            <article
              key={bookmark.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200 hover:-translate-y-2 hover:shadow-2xl transition duration-300 dark:bg-slate-900 dark:border-slate-800"
            >

              {bookmark.post.featured_image ? (

                <img
                  src={bookmark.post.featured_image}
                  alt={bookmark.post.title}
                  className="w-full h-56 object-cover"
                />

              ) : (

                <div className="h-56 bg-linear-to-r from-slate-200 to-slate-300 flex items-center justify-center text-5xl dark:from-slate-800 dark:to-slate-700">
                  📰
                </div>

              )}

              <div className="p-6">

                <h2
                  className="text-2xl font-semibold text-slate-800 line-clamp-2 dark:text-white"
                  style={{ fontFamily: "var(--font-serif, serif)" }}
                >
                  {bookmark.post.title}
                </h2>

                <div className="flex items-center justify-between mt-4 text-sm text-slate-500 dark:text-slate-400">

                  <span>
                    👤 {bookmark.post.author.username}
                  </span>

                  {bookmark.post.category && (
                    <span className="bg-rose-50 text-rose-800 px-3 py-1 rounded-full dark:bg-rose-950/40 dark:text-rose-400">
                      {bookmark.post.category.name}
                    </span>
                  )}

                </div>

                <Link
                  to={`/posts/${bookmark.post.slug}`}
                  className="inline-flex items-center justify-center mt-6 w-full bg-rose-800 hover:bg-rose-900 text-white py-3 rounded-xl font-semibold transition dark:bg-rose-600 dark:hover:bg-rose-500"
                >
                  Read Article →
                </Link>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyBookmarks;