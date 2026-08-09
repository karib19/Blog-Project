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
  const [copied, setCopied] = useState(false);


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

  const postUrl = window.location.href;
  const postTitle = post?.title || "";

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(postTitle + " " + postUrl)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

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

      {/* Share Buttons */}

      <div className="flex flex-wrap items-center gap-3 mb-8 py-5 border-y">

        <span className="text-gray-700 font-semibold mr-2">
          Share:
        </span>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
          title="Share on Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z"/>
          </svg>
        </a>

        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 text-white transition"
          title="Share on X"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white transition"
          title="Share on WhatsApp"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.876.51 3.632 1.397 5.14L2 22l4.995-1.311A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.06a8.02 8.02 0 01-4.09-1.12l-.293-.174-3.02.793.806-2.943-.19-.303A8.024 8.024 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
          </svg>
        </a>

        <button
          onClick={handleCopyLink}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          title="Copy Link"
        >
          {copied ? (
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          )}
        </button>

        {copied && (
          <span className="text-sm text-green-600 font-medium">
            Link copied!
          </span>
        )}

      </div>

      {/* Article */}

      <article
        className="prose prose-lg max-w-none leading-8 text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

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