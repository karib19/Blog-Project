import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function PopularSidebar({ excludeSlug }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = excludeSlug ? `?exclude=${excludeSlug}` : "";

    api
      .get(`posts/popular/${params}`)
      .then((response) => {
        setPosts(response.data.results || response.data);
      })
      .catch((error) => {
        console.error(error.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [excludeSlug]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 dark:bg-slate-900 dark:border-slate-800">
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded dark:bg-slate-800"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3 dark:bg-slate-800"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 dark:bg-slate-900 dark:border-slate-800">

      <h3
        className="text-lg font-semibold text-slate-900 mb-5 dark:text-white"
        style={{ fontFamily: "var(--font-serif, serif)" }}
      >
        🔥 Most Popular
      </h3>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            to={`/posts/${post.slug}`}
            className="flex gap-3 group"
          >
            <span
              className="w-8 h-8 rounded-full bg-rose-50 text-rose-800 flex items-center justify-center text-sm font-bold shrink-0 dark:bg-rose-950/40 dark:text-rose-400"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {index + 1}
            </span>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2 group-hover:text-rose-800 transition dark:text-slate-200 dark:group-hover:text-rose-400">
                {post.title}
              </p>

              <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
                👁 {post.views} views
              </p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default PopularSidebar;