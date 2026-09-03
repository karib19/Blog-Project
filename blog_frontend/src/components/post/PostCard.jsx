import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";

function PostCard({ post }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const [bookmarked, setBookmarked] = useState(post.is_bookmarked);
  const [bookmarksCount, setBookmarksCount] = useState(
    post.bookmarks_count
  );

  // =========================
  // LIKE
  // =========================
  const handleLike = async () => {
    try {
      await api.post(`posts/${post.slug}/like/`);

      if (liked) {
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", {
          state: {
            from: location.pathname,
          },
        });
        return;
      }

      console.error(error.response?.data || error);
    }
  };

  // =========================
  // BOOKMARK
  // =========================
  const handleBookmark = async () => {
    try {
      await api.post(`posts/${post.slug}/bookmark/`);

      if (bookmarked) {
        setBookmarked(false);
        setBookmarksCount((prev) => prev - 1);
      } else {
        setBookmarked(true);
        setBookmarksCount((prev) => prev + 1);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", {
          state: {
            from: location.pathname,
          },
        });
        return;
      }

      console.error(error.response?.data || error);
    }
  };

  return (
    <article
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-0.5
        transition-all
        duration-300
        overflow-hidden
        flex
        flex-col
        dark:bg-slate-900
        dark:border-slate-800
      "
    >
      {/* =========================
          FEATURED IMAGE
      ========================== */}
      <div className="relative">
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-56 object-cover"
          />
        ) : (
          <div
            className="
              h-56
              bg-slate-100
              flex
              items-center
              justify-center
              text-slate-400
              dark:bg-slate-800
              dark:text-slate-600
            "
          >
            No Image
          </div>
        )}

        {post.is_featured && (
          <span
            className="
              absolute
              top-3
              left-3
              bg-amber-400
              text-slate-900
              px-2.5
              py-1
              rounded-full
              text-xs
              font-semibold
              tracking-wide
            "
          >
            ★ Featured
          </span>
        )}
      </div>

      {/* =========================
          CARD CONTENT
      ========================== */}
      <div className="p-6 flex flex-col flex-1">

        {/* Category + Date */}
        <div
          className="
            flex
            items-center
            gap-2
            text-xs
            uppercase
            tracking-widest
            text-slate-500
            mb-3
            dark:text-slate-400
          "
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >
          <span className="text-rose-800 font-semibold dark:text-rose-400">
            {post.category?.name || "General"}
          </span>

          <span className="text-slate-300 dark:text-slate-600">
            ·
          </span>

          <span>
            {post.created_at
              ? new Date(post.created_at).toLocaleDateString()
              : ""}
          </span>
        </div>

        {/* =========================
            TITLE
        ========================== */}
        <Link to={`/posts/${post.slug}`}>
          <h2
            className="
              text-2xl
              font-semibold
              leading-snug
              text-slate-900
              hover:text-rose-800
              transition
              mb-6
              dark:text-white
              dark:hover:text-rose-400
            "
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            {post.title}
          </h2>
        </Link>

        {/* =========================
            TAGS
        ========================== */}
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags?.length ? (
            post.tags.map((tag) => (
              <span
                key={tag.id}
                className="
                  bg-slate-100
                  text-slate-600
                  text-xs
                  px-2.5
                  py-1
                  rounded-md
                  dark:bg-slate-800
                  dark:text-slate-400
                "
              >
                #{tag.name}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-xs dark:text-slate-600">
              No Tags
            </span>
          )}
        </div>

        {/* =========================
            AUTHOR + READING TIME + VIEWS
        ========================== */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-slate-100
            pt-4
            text-sm
            text-slate-500
            dark:border-slate-800
            dark:text-slate-400
          "
        >
          {/* Author */}
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {post.author?.username || "Unknown"}
            </p>

            <p
              className="text-xs tracking-wide"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              ⏱ {post.reading_time || 1} min read
            </p>
          </div>

          {/* Views */}
          <div className="text-right">
            <p
              className="text-xs tracking-wide"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              👁 {post.views || 0}
            </p>
          </div>
        </div>

        {/* =========================
            LIKE + BOOKMARK
        ========================== */}
        <div className="flex gap-3 mt-6">
          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className={`
              flex-1
              rounded-lg
              py-2
              text-sm
              font-medium
              transition
              ${
                liked
                  ? "bg-rose-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              }
            `}
          >
            ❤️ {likesCount}
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`
              flex-1
              rounded-lg
              py-2
              text-sm
              font-medium
              transition
              ${
                bookmarked
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }
            `}
          >
            🔖 {bookmarksCount}
          </button>
        </div>

        {/* =========================
            READ MORE
        ========================== */}
        <Link
          to={`/posts/${post.slug}`}
          className="
            mt-5
            w-full
            bg-slate-900
            text-white
            py-3
            rounded-lg
            text-sm
            font-medium
            text-center
            hover:bg-rose-800
            transition
            dark:bg-white
            dark:text-slate-900
            dark:hover:bg-rose-400
          "
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}

export default PostCard;