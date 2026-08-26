import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import api from "../../api/axios";
import PostCard from "../../components/post/PostCard";
import TrendingStrip from "../../components/post/TrendingStrip";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [page, setPage] = useState(1);

  const loadPosts = useCallback(() => {
    setLoading(true);

    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (tag) params.append("tags", tag);

    params.append("ordering", ordering);
    params.append("page", page);

    api
      .get(`posts/?${params.toString()}`)
      .then((response) => {
        setPosts(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);
      })
      .catch((error) => {
        console.log(error.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, category, tag, ordering, page]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    api
      .get("categories/")
      .then((response) => {
        setCategories(response.data.results || response.data);
      });

    api
      .get("tags/")
      .then((response) => {
        setTags(response.data.results || response.data);
      });
  }, []);

  return (
    <div className="space-y-10">

      <Helmet>
  <title>BlogSphere — Discover Amazing Stories</title>
  <meta
    name="description"
    content="Programming, AI, Technology, Sports, History and everything in between."
  />
</Helmet>

      {/* Hero */}

      <section className="rounded-3xl bg-linear-to-r from-rose-900 via-rose-950 to-slate-800 text-white p-10 shadow-xl">

        <div className="max-w-3xl">

          <p
            className="uppercase tracking-widest text-rose-300 text-xs mb-3"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
          >
            History · Sports · Politics · and more
          </p>

          <h1
            className="text-5xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            Discover Amazing Stories
          </h1>

          <p className="text-rose-100 text-lg mb-8">
            Programming, AI, Technology, Lifestyle
            and everything in between.
          </p>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 rounded-xl px-5 py-4 text-slate-900 outline-none"
            />

            <button
              className="bg-white text-rose-800 px-8 rounded-xl font-semibold hover:bg-rose-50 transition"
            >
              Search
            </button>

          </div>

        </div>

      </section>

      {/* Trending Strip */}

    <TrendingStrip />

      {/* Filters */}

      <section className="bg-white rounded-2xl shadow-lg p-6 dark:bg-slate-900 dark:border dark:border-slate-800">

        <div className="grid md:grid-cols-3 gap-6">

          <div>

            <label className="font-semibold mb-2 block text-slate-700 dark:text-slate-200">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:ring-2 focus:ring-rose-800 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              <option value="">
                All Categories
              </option>

              {categories.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}

            </select>

          </div>

          <div>

            <label className="font-semibold mb-2 block text-slate-700 dark:text-slate-200">
              Tag
            </label>

            <select
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
                setPage(1);
              }}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:ring-2 focus:ring-rose-800 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              <option value="">
                All Tags
              </option>

              {tags.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}

            </select>

          </div>

          <div>

            <label className="font-semibold mb-2 block text-slate-700 dark:text-slate-200">
              Sort
            </label>

            <select
              value={ordering}
              onChange={(e) => {
                setOrdering(e.target.value);
                setPage(1);
              }}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-900 focus:ring-2 focus:ring-rose-800 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              <option value="-created_at">
                Newest
              </option>

              <option value="created_at">
                Oldest
              </option>

              <option value="-updated_at">
                Recently Updated
              </option>

              <option value="-views">
                Most Viewed
              </option>

            </select>

          </div>

        </div>

      </section>

      {/* Heading */}

      <div className="flex justify-between items-center">

        <h2
          className="text-3xl font-semibold text-slate-900 dark:text-white"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          Latest Articles
        </h2>

        <span className="text-slate-500 dark:text-slate-400">
          {posts.length} Posts
        </span>

      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse dark:bg-slate-900"
            >
              <div className="h-60 bg-slate-300 dark:bg-slate-800"></div>

              <div className="p-6 space-y-4">

                <div className="h-4 bg-slate-300 rounded w-1/3 dark:bg-slate-800"></div>

                <div className="h-6 bg-slate-300 rounded dark:bg-slate-800"></div>

                <div className="h-4 bg-slate-300 rounded dark:bg-slate-800"></div>

                <div className="h-4 bg-slate-300 rounded w-2/3 dark:bg-slate-800"></div>

              </div>

            </div>
          ))}

        </div>

      ) : posts.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-lg p-20 text-center dark:bg-slate-900 dark:border dark:border-slate-800">

          <h3 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
            No Posts Found
          </h3>

          <p className="text-slate-500 dark:text-slate-400">
            Try changing your search or filters.
          </p>

        </div>

      ) : (

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}

        </div>

      )}

      {/* Pagination */}

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={!previousPage}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            previousPage
              ? "bg-rose-800 hover:bg-rose-900 text-white dark:bg-rose-600 dark:hover:bg-rose-500"
              : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
          }`}
        >
          ← Previous
        </button>

        <div className="bg-white shadow rounded-xl px-6 py-3 font-semibold text-slate-900 dark:bg-slate-900 dark:text-white dark:border dark:border-slate-800">

          Page {page}

        </div>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!nextPage}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            nextPage
              ? "bg-rose-800 hover:bg-rose-900 text-white dark:bg-rose-600 dark:hover:bg-rose-500"
              : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
          }`}
        >
          Next →
        </button>

      </div>

    </div>
  );
}

export default Home;