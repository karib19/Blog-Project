import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";

function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access");
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPost = () => {
    setLoading(true);

    api
      .get(`posts/${slug}/`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadComments = () => {
    api
      .get(`posts/${slug}/comments/`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setComments(response.data);
        } else {
          setComments(response.data.results || []);
        }
      })
      .catch((error) => {
        console.error(error);
        setComments([]);
      });
  };

  useEffect(() => {
    loadPost();
    loadComments();
  }, [slug]);

  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await api.post(`posts/${slug}/comments/`, {
        content: comment,
      });

      setComment("");
      loadComments();
    } catch (error) {

  if (error.response?.status === 401) {
    navigate("/login", {
      state: {
        from: location.pathname,
      },
    });
    return;
  }

  console.error(error.response?.data);
}
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">

        <div className="h-96 bg-gray-300 rounded-3xl mb-8"></div>

        <div className="h-10 bg-gray-300 rounded w-2/3 mb-6"></div>

        <div className="h-5 bg-gray-300 rounded w-1/3 mb-10"></div>

        <div className="space-y-4">

          <div className="h-5 bg-gray-300 rounded"></div>
          <div className="h-5 bg-gray-300 rounded"></div>
          <div className="h-5 bg-gray-300 rounded w-5/6"></div>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Hero Image */}

      {post.featured_image && (
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-112.5 object-cover rounded-3xl shadow-xl mb-8"
        />
      )}

      {/* Category + Date */}

      <div className="flex flex-wrap items-center gap-3 mb-5">

        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
          {post.category?.name || "General"}
        </span>

        {post.is_featured && (
          <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
            ⭐ Featured
          </span>
        )}

        <span className="text-gray-500 text-sm">
          {post.created_at
            ? new Date(post.created_at).toLocaleDateString()
            : ""}
        </span>

      </div>

      {/* Title */}

      <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
        {post.title}
      </h1>

      {/* Author */}

      <div className="flex flex-wrap justify-between gap-6 border-y py-5 mb-8">

        <div>

          <p className="font-semibold text-lg">
            {post.author.username}
          </p>

          <p className="text-gray-500">
            Author
          </p>

        </div>

        <div className="flex flex-wrap gap-6 text-gray-600">

          <span>
            ❤️ {post.likes_count}
          </span>

          <span>
            🔖 {post.bookmarks_count}
          </span>

          <span>
            👁 {post.views}
          </span>

          <span>
            ⏱ {post.reading_time} min read
          </span>

        </div>

      </div>

      {/* Tags */}

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">

          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
            >
              #{tag.name}
            </span>
          ))}

        </div>
      )}

      {/* Article */}

      <article className="prose prose-lg max-w-none leading-8 text-gray-700">

        <p className="whitespace-pre-line">
          {post.content}
        </p>

      </article>

      {/* Comments */}

      <section className="mt-16">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-bold">
            Comments
          </h2>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            {comments.length} Comments
          </span>

        </div>

        {comments.length === 0 ? (

          <div className="bg-gray-50 border rounded-2xl p-10 text-center">

            <h3 className="text-xl font-semibold mb-2">
              No comments yet
            </h3>

            <p className="text-gray-500">
              Be the first person to comment on this article.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {comments.map((item) => (

              <div
                key={item.id}
                className="bg-white shadow rounded-2xl p-6"
              >

                <div className="flex justify-between items-center mb-3">

                  <div>

                    <h4 className="font-bold">
                      {item.user?.username}
                    </h4>

                    <p className="text-sm text-gray-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "Just now"}
                    </p>

                  </div>

                </div>

                <p className="text-gray-700 whitespace-pre-line">
                  {item.content}
                </p>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* Comment Form */}

      <section className="mt-14">

  <div className="bg-white rounded-3xl shadow-lg p-8">

    <h3 className="text-2xl font-bold mb-6">
      Leave a Comment
    </h3>

    {token ? (

      <form
        onSubmit={handleComment}
        className="space-y-5"
      >

        <textarea
          rows="5"
          placeholder="Write your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-xl px-5 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          Post Comment
        </button>

      </form>

    ) : (

      <div className="text-center">

        <p className="text-gray-600 mb-5">
          You must login to post a comment.
        </p>

        <button
          onClick={() =>
            navigate("/login", {
              state: {
                from: location.pathname,
              },
            })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Login to Comment
        </button>

      </div>

    )}

  </div>

</section>

    </div>
  );
}

export default PostDetail;