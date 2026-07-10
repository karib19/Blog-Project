import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function PostCard({ post }) {
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const [bookmarked, setBookmarked] = useState(post.is_bookmarked);
  const [bookmarksCount, setBookmarksCount] = useState(post.bookmarks_count);

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
      console.error(error.response?.data);
    }
  };

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
      console.error(error.response?.data);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col">

      <div className="relative">

        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-60 object-cover"
          />
        ) : (
          <div className="h-60 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        {post.is_featured && (
          <span className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {post.category?.name || "General"}
          </span>

          <span>
            {post.created_at
              ? new Date(post.created_at).toLocaleDateString()
              : ""}
          </span>

        </div>

        <Link to={`/posts/${post.slug}`}>
          <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition mb-3">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-5 flex-1">
          {post.excerpt ||
            `${post.content.slice(0, 120)}...`}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags?.length ? (
            post.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
              >
                #{tag.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">
              No Tags
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-4 text-sm text-gray-500">

          <div>
            <p className="font-medium text-gray-700">
              {post.author.username}
            </p>

            <p>
              ⏱ {post.reading_time} min read
            </p>
          </div>

          <div className="text-right">
            <p>👁 {post.views}</p>
          </div>

        </div>

        <div className="flex gap-3 mt-6">

          <button
            onClick={handleLike}
            className={`flex-1 rounded-lg py-2 transition ${
              liked
                ? "bg-red-500 text-white"
                : "bg-gray-100 hover:bg-red-100"
            }`}
          >
            ❤️ {likesCount}
          </button>

          <button
            onClick={handleBookmark}
            className={`flex-1 rounded-lg py-2 transition ${
              bookmarked
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-blue-100"
            }`}
          >
            🔖 {bookmarksCount}
          </button>

        </div>

        <Link
          to={`/posts/${post.slug}`}
          className="mt-5"
        >
          <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Read More →
          </button>
        </Link>

      </div>

    </article>
  );
}

export default PostCard;