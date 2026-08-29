import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import PostCard from "../../components/post/PostCard";

function Archive() {
  const { year, month } = useParams();

  const [summary, setSummary] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadedArchiveKey, setLoadedArchiveKey] = useState(null);

  useEffect(() => {
    api
      .get("archive/")
      .then((response) => {
        setSummary(response.data);
      })
      .catch((error) => {
        console.error(error.response?.data);
      })
      .finally(() => {
        setLoadingSummary(false);
      });
  }, []);

  useEffect(() => {
    if (!year || !month) return;

    let cancelled = false;

    api
      .get(`archive/${year}/${month}/`)
      .then((response) => {
        if (cancelled) return;
        setPosts(response.data.results || response.data);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(error.response?.data);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadedArchiveKey(`${year}-${month}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const hasArchiveSelection = Boolean(year && month);
  const archiveKey = hasArchiveSelection ? `${year}-${month}` : null;
  const loadingPosts = hasArchiveSelection && loadedArchiveKey !== archiveKey;
  const activeLabel = summary.find(
    (item) => String(item.year) === year && String(item.month) === month
  )?.label;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="bg-linear-to-r from-rose-800 to-slate-800 rounded-3xl shadow-xl text-white p-8 mb-10">

        <h1
          className="text-4xl font-semibold"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          🗄 Post Archive
        </h1>

        <p className="mt-3 text-rose-100">
          Browse past articles month by month.
        </p>

      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-10">

        {/* Month List */}
        <aside className="lg:sticky lg:top-24 h-fit">

          <div className="bg-white rounded-2xl border border-slate-200 p-6 dark:bg-slate-900 dark:border-slate-800">

            <h3
              className="text-lg font-semibold text-slate-900 mb-4 dark:text-white"
              style={{ fontFamily: "var(--font-serif, serif)" }}
            >
              Browse by Month
            </h3>

            {loadingSummary ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-slate-200 rounded dark:bg-slate-800"></div>
                ))}
              </div>
            ) : summary.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No archived posts yet.
              </p>
            ) : (
              <nav className="space-y-1">
                {summary.map((item) => {
                  const isActive =
                    String(item.year) === year && String(item.month) === month;

                  return (
                    <Link
                      key={`${item.year}-${item.month}`}
                      to={`/archive/${item.year}/${item.month}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                        isActive
                          ? "bg-rose-800 text-white font-semibold dark:bg-rose-600"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`text-xs ${
                          isActive ? "text-rose-100" : "text-slate-400 dark:text-slate-500"
                        }`}
                        style={{ fontFamily: "var(--font-mono, monospace)" }}
                      >
                        {item.count}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            )}

          </div>

        </aside>

        {/* Posts */}
        <div>

          {!hasArchiveSelection ? (

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center dark:bg-slate-900 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">
                Select a month from the list to browse articles.
              </p>
            </div>

          ) : (

            <>
              <h2
                className="text-2xl font-semibold text-slate-900 mb-6 dark:text-white"
                style={{ fontFamily: "var(--font-serif, serif)" }}
              >
                {activeLabel || `${month}/${year}`}
              </h2>

              {loadingPosts ? (

                <div className="grid gap-8 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse dark:bg-slate-900"
                    >
                      <div className="h-48 bg-slate-300 dark:bg-slate-800"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-slate-300 rounded w-1/3 dark:bg-slate-800"></div>
                        <div className="h-6 bg-slate-300 rounded dark:bg-slate-800"></div>
                      </div>
                    </div>
                  ))}
                </div>

              ) : posts.length === 0 ? (

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center dark:bg-slate-900 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400">
                    No posts found for this month.
                  </p>
                </div>

              ) : (

                <div className="grid gap-8 md:grid-cols-2">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

              )}
            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default Archive;