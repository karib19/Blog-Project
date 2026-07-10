import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import PostCard from "../../components/post/PostCard";

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

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-10 shadow-xl">

        <div className="max-w-3xl">

          <h1 className="text-5xl font-bold mb-4">
            Discover Amazing Stories
          </h1>

          <p className="text-blue-100 text-lg mb-8">
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
              className="flex-1 rounded-xl px-5 py-4 text-gray-700 outline-none"
            />

            <button
              className="bg-white text-blue-700 px-8 rounded-xl font-semibold hover:bg-gray-100"
            >
              Search
            </button>

          </div>

        </div>

      </section>

      {/* Filters */}

      <section className="bg-white rounded-2xl shadow-lg p-6">

        <div className="grid md:grid-cols-3 gap-6">

          <div>

            <label className="font-semibold mb-2 block">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded-xl px-4 py-3"
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

            <label className="font-semibold mb-2 block">
              Tag
            </label>

            <select
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded-xl px-4 py-3"
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

            <label className="font-semibold mb-2 block">
              Sort
            </label>

            <select
              value={ordering}
              onChange={(e) => {
                setOrdering(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded-xl px-4 py-3"
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

        <h2 className="text-3xl font-bold">
          Latest Articles
        </h2>

        <span className="text-gray-500">
          {posts.length} Posts
        </span>

      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-60 bg-gray-300"></div>

              <div className="p-6 space-y-4">

                <div className="h-4 bg-gray-300 rounded w-1/3"></div>

                <div className="h-6 bg-gray-300 rounded"></div>

                <div className="h-4 bg-gray-300 rounded"></div>

                <div className="h-4 bg-gray-300 rounded w-2/3"></div>

              </div>

            </div>
          ))}

        </div>

      ) : posts.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-lg p-20 text-center">

          <h3 className="text-3xl font-bold mb-3">
            No Posts Found
          </h3>

          <p className="text-gray-500">
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
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          ← Previous
        </button>

        <div className="bg-white shadow rounded-xl px-6 py-3 font-semibold">

          Page {page}

        </div>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!nextPage}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            nextPage
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next →
        </button>

      </div>

    </div>
  );
}

export default Home;