import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
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

        <div className="h-96 bg-slate-200 rounded-3xl mb-8 dark:bg-slate-800"></div>

        <div className="h-10 bg-slate-200 rounded w-2/3 mb-6 dark:bg-slate-800"></div>

        <div className="h-5 bg-slate-200 rounded w-1/3 mb-10 dark:bg-slate-800"></div>

        <div className="space-y-4">

          <div className="h-5 bg-slate-200 rounded dark:bg-slate-800"></div>
          <div className="h-5 bg-slate-200 rounded dark:bg-slate-800"></div>
          <div className="h-5 bg-slate-200 rounded w-5/6 dark:bg-slate-800"></div>

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

      <div
        className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-slate-500 mb-5 dark:text-slate-400"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >

        <span className="text-rose-800 font-semibold dark:text-rose-400">
          {post.category?.name || "General"}
        </span>

        {post.is_featured && (
          <>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-amber-600 font-semibold dark:text-amber-400">
              ★ Featured
            </span>
          </>
        )}

        <span className="text-slate-300 dark:text-slate-600">·</span>

        <span>
          {post.created_at
            ? new Date(post.created_at).toLocaleDateString()
            : ""}
        </span>

      </div>

      {/* Title */}

      <h1
        className="text-4xl sm:text-5xl font-semibold text-slate-900 leading-tight mb-6 dark:text-white"
        style={{ fontFamily: "var(--font-serif, serif)" }}
      >
        {post.title}
      </h1>

      {/* Author */}

      <div className="flex flex-wrap justify-between gap-6 border-y border-slate-200 py-5 mb-8 dark:border-slate-800">

        <div>

          <p className="font-semibold text-lg text-slate-900 dark:text-white">
            {post.author.username}
          </p>

          <p className="text-slate-500 text-sm dark:text-slate-400">
            Author
          </p>

        </div>

        <div
          className="flex flex-wrap gap-6 text-slate-600 text-sm dark:text-slate-400"
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >

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
              className="bg-slate-100 px-3 py-1 rounded-md text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              #{tag.name}
            </span>
          ))}

        </div>
      )}

      {/* Share Buttons */}

      <div className="flex flex-wrap items-center gap-3 mb-8 py-5 border-y border-slate-200 dark:border-slate-800">

        <span className="text-slate-700 font-semibold mr-2 dark:text-slate-200">
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
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Copy Link"
        >
          {copied ? (
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          )}
        </button>

        {copied && (
          <span className="text-sm text-green-600 font-medium dark:text-green-400">
            Link copied!
          </span>
        )}

      </div>

      {/* Article */}

      <article
        className="prose prose-lg dark:prose-invert max-w-none leading-8 text-slate-700 dark:text-slate-300 wrap-break-word [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />


        {/* Related Posts */}

{post.related_posts?.length > 0 && (
  <section className="mt-16">

    <h2
      className="text-3xl font-semibold text-slate-900 mb-8 dark:text-white"
      style={{ fontFamily: "var(--font-serif, serif)" }}
    >
      Related Articles
    </h2>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

      {post.related_posts.map((related) => (

        <Link
          key={related.slug}
          to={`/posts/${related.slug}`}
          className="group block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition overflow-hidden dark:bg-slate-900 dark:border-slate-800"
        >

          {related.featured_image ? (
            <img
              src={related.featured_image}
              alt={related.title}
              className="w-full h-36 object-cover"
            />
          ) : (
            <div className="w-full h-36 bg-slate-100 flex items-center justify-center text-2xl dark:bg-slate-800">
              📰
            </div>
          )}

          <div className="p-4">

            <p
              className="text-xs uppercase tracking-widest text-rose-800 font-semibold mb-2 dark:text-rose-400"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              {related.category}
            </p>

            <h3 className="font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-rose-800 transition dark:text-white dark:group-hover:text-rose-400">
              {related.title}
            </h3>

            <p className="text-xs text-slate-400 mt-2 dark:text-slate-500">
              {related.reading_time} min read
            </p>

          </div>

        </Link>

      ))}

    </div>

  </section>
)}


      {/* Comments */}

      <section className="mt-16">

        <div className="flex items-center justify-between mb-8">

          <h2
            className="text-3xl font-semibold text-slate-900 dark:text-white"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            Comments
          </h2>

          <span className="bg-rose-50 text-rose-800 px-4 py-2 rounded-full font-semibold text-sm dark:bg-rose-950/40 dark:text-rose-400">
            {comments.length} Comments
          </span>

        </div>

        {comments.length === 0 ? (

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center dark:bg-slate-900 dark:border-slate-800">

            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
              No comments yet
            </h3>

            <p className="text-slate-500 dark:text-slate-400">
              Be the first person to comment on this article.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {comments.map((item) => (

              <div
                key={item.id}
                className="bg-white shadow-sm border border-slate-100 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800"
              >

                <div className="flex justify-between items-center mb-3">

                  <div>

                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {item.user?.username}
                    </h4>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "Just now"}
                    </p>

                  </div>

                </div>

                <p className="text-slate-700 whitespace-pre-line dark:text-slate-300">
                  {item.content}
                </p>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* Comment Form */}

      <section className="mt-14">

  <div className="bg-white shadow-lg border border-slate-100 rounded-3xl p-8 dark:bg-slate-900 dark:border-slate-800">

    <h3 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
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
          className="w-full border border-slate-200 rounded-xl px-5 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-rose-800 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
        />

        <button
          type="submit"
          className="bg-rose-800 hover:bg-rose-900 text-white px-8 py-3 rounded-xl font-semibold transition dark:bg-rose-600 dark:hover:bg-rose-500"
        >
          Post Comment
        </button>

      </form>

    ) : (

      <div className="text-center">

        <p className="text-slate-600 mb-5 dark:text-slate-400">
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
          className="bg-rose-800 hover:bg-rose-900 text-white px-6 py-3 rounded-xl font-semibold transition dark:bg-rose-600 dark:hover:bg-rose-500"
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