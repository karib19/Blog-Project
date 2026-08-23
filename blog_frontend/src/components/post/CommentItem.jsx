import { useState } from "react";
import api from "../../api/axios";

function Avatar({ username }) {
  const letter = username ? username.charAt(0).toUpperCase() : "?";

  return (
    <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-800 flex items-center justify-center text-sm font-bold shrink-0 dark:bg-rose-950/40 dark:text-rose-400">
      {letter}
    </div>
  );
}

function CommentItem({
  comment,
  slug,
  token,
  currentUserId,
  onLoginRequired,
  onCommentPosted,
  depth = 0,
  replyingToUsername = null,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const isOwnComment =
    currentUserId != null && comment.user?.id === currentUserId;

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      onLoginRequired();
      return;
    }

    if (!replyText.trim()) return;

    setSubmitting(true);

    try {
      await api.post(`posts/${slug}/comments/`, {
        content: replyText,
        parent: comment.id,
      });

      setReplyText("");
      setShowReplyForm(false);
      onCommentPosted();
    } catch (error) {
      console.error(error.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Delete this comment? This cannot be undone."
    );

    if (!confirmDelete) return;

    setDeleting(true);

    try {
      await api.delete(`comments/${comment.id}/delete/`);
      setDeleted(true);
      onCommentPosted();
    } catch (error) {
      console.error(error.response?.data);
      alert("Failed to delete comment.");
    } finally {
      setDeleting(false);
    }
  };

  if (deleted) return null;

  const hasReplies = comment.replies?.length > 0;

  return (
    <div className="flex gap-3">

      {/* Avatar + connecting line */}
      <div className="flex flex-col items-center shrink-0">
        <Avatar username={comment.user?.username} />
        {(hasReplies && repliesOpen) && (
          <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 mt-2"></div>
        )}
      </div>

      <div className="flex-1 min-w-0 pb-2">

        <div className="bg-slate-50 rounded-2xl px-4 py-3 dark:bg-slate-800/60">

          <div className="flex items-baseline justify-between gap-2 flex-wrap">

            <div className="flex items-baseline gap-2 flex-wrap">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                {comment.user?.username}
              </h4>

              <span className="text-xs text-slate-400 dark:text-slate-500">
                {comment.created_at
                  ? new Date(comment.created_at).toLocaleString()
                  : "Just now"}
              </span>
            </div>

            {isOwnComment && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                title="Delete comment"
                className="text-xs text-slate-400 hover:text-rose-700 transition disabled:opacity-50 dark:text-slate-500 dark:hover:text-rose-400"
              >
                {deleting ? "..." : "🗑"}
              </button>
            )}

          </div>

          <p className="text-slate-700 whitespace-pre-line text-sm mt-1 dark:text-slate-300">
            {replyingToUsername && (
              <span className="font-semibold text-rose-800 dark:text-rose-400 mr-1">
                @{replyingToUsername}
              </span>
            )}
            {comment.content}
          </p>

        </div>

        <div className="flex items-center gap-4 mt-1.5 pl-1">

          <button
            onClick={() => {
              if (!token) {
                onLoginRequired();
                return;
              }
              setShowReplyForm((prev) => !prev);
            }}
            className="text-xs font-semibold text-slate-500 hover:text-rose-800 transition dark:text-slate-400 dark:hover:text-rose-400"
          >
            {showReplyForm ? "Cancel" : "Reply"}
          </button>

          {hasReplies && (
            <button
              onClick={() => setRepliesOpen((prev) => !prev)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition flex items-center gap-1 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <span>{repliesOpen ? "▾" : "▸"}</span>
              {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}

        </div>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-3 flex gap-2">

            <textarea
              rows="1"
              placeholder={`Reply to ${comment.user?.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-800 bg-white text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-rose-800 hover:bg-rose-900 text-white px-4 rounded-xl text-sm font-semibold transition disabled:opacity-50 dark:bg-rose-600 dark:hover:bg-rose-500"
            >
              {submitting ? "..." : "Send"}
            </button>

          </form>
        )}

        {hasReplies && repliesOpen && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                slug={slug}
                token={token}
                currentUserId={currentUserId}
                onLoginRequired={onLoginRequired}
                onCommentPosted={onCommentPosted}
                depth={depth + 1}
                replyingToUsername={comment.user?.username}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default CommentItem;