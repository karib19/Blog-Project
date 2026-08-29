import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../api/axios";
import PostCard from "../../components/post/PostCard";

function AuthorProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("access");

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get(`author/${username}/`)
      .then((response) => {
        if (cancelled) return;

        setAuthor(response.data.author);
        setPosts(response.data.results);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(error.response?.data);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const handleFollowToggle = async () => {
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setFollowLoading(true);

    try {
      const response = await api.post(`follow/${username}/`);

      setAuthor((prev) => ({
        ...prev,
        is_following: response.data.is_following,
        followers_count: response.data.is_following
          ? prev.followers_count + 1
          : prev.followers_count - 1,
      }));
    } catch (error) {
      console.error(error.response?.data);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-14 w-14 border-4 border-rose-800 border-t-transparent rounded-full animate-spin dark:border-rose-400"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Author Not Found
          </h1>
          <p className="text-slate-500 mt-2 dark:text-slate-400">
            This author doesn't exist or has no published posts.
          </p>
        </div>
      </div>
    );
  }

  const fullName =
    author.first_name || author.last_name
      ? `${author.first_name} ${author.last_name}`.trim()
      : author.username;

  const isOwnProfile = localStorage.getItem("username") === username;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Author Header */}
      <div className="bg-linear-to-r from-rose-800 to-slate-800 rounded-3xl shadow-xl text-white p-8 mb-10">

        <div className="flex flex-col md:flex-row items-center gap-6">

          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white text-rose-800 flex items-center justify-center text-3xl font-bold shadow-lg shrink-0">
              {author.username.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center md:text-left">

            <h1
              className="text-3xl font-semibold"
              style={{ fontFamily: "var(--font-serif, serif)" }}
            >
              {fullName}
            </h1>

            <p className="text-rose-200 mt-1">
              @{author.username}
            </p>

            <div
              className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-rose-100"
              style={{ fontFamily: "var(--font-mono, monospace)" }}
            >
              <span>{author.total_posts} posts</span>
              <span>·</span>
              <span>{author.followers_count} followers</span>
              <span>·</span>
              <span>{author.following_count} following</span>

              {author.joined && (
                <>
                  <span>·</span>
                  <span>
                    Joined {new Date(author.joined).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>

          </div>

          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition disabled:opacity-50 ${
                author.is_following
                  ? "bg-white/10 border border-white/40 text-white hover:bg-white/20"
                  : "bg-white text-rose-800 hover:bg-rose-50"
              }`}
            >
              {followLoading
                ? "..."
                : author.is_following
                ? "Following ✓"
                : "+ Follow"}
            </button>
          )}

        </div>

      </div>

      {/* Posts */}

      <h2
        className="text-2xl font-semibold text-slate-900 mb-6 dark:text-white"
        style={{ fontFamily: "var(--font-serif, serif)" }}
      >
        Articles by {author.username}
      </h2>

      {posts.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center dark:bg-slate-900 dark:border-slate-800">

          <p className="text-slate-500 dark:text-slate-400">
            This author hasn't published any posts yet.
          </p>

        </div>

      ) : (

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

        </div>

      )}

    </div>
  );
}

export default AuthorProfile;