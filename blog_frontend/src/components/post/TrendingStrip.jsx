import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function TrendingStrip() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("posts/trending/?days=7")
      .then((response) => {
        setPosts(response.data.results || response.data);
      })
      .catch((error) => {
        console.error(error.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section>

      <div className="flex items-center gap-2 mb-4">
        <h2
          className="text-2xl font-semibold text-slate-900 dark:text-white"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          🔥 Trending This Week
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/posts/${post.slug}`}
            className="group shrink-0 w-64 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition overflow-hidden dark:bg-slate-900 dark:border-slate-800"
          >
            {post.featured_image ? (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-2xl dark:bg-slate-800">
                📰
              </div>
            )}

            <div className="p-4">
              <p
                className="text-xs uppercase tracking-widest text-rose-800 font-semibold mb-1 dark:text-rose-400"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                {post.category?.name || "General"}
              </p>

              <h3 className="font-semibold text-sm text-slate-800 leading-snug line-clamp-2 group-hover:text-rose-800 transition dark:text-white dark:group-hover:text-rose-400">
                {post.title}
              </h3>

              <p className="text-xs text-slate-400 mt-2 dark:text-slate-500">
                👁 {post.views} views
              </p>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}

export default TrendingStrip;