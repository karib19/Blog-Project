import { useState } from "react";
import api from "../../api/axios";

const REPORT_REASONS = [
  { value: "spam", label: "Spam or Advertisement" },
  { value: "harassment", label: "Harassment or Bullying" },
  { value: "hate_speech", label: "Hate Speech" },
  { value: "misinformation", label: "Misinformation" },
  { value: "nsfw", label: "Inappropriate / NSFW Content" },
  { value: "other", label: "Other" },
];

/**
 * ব্যবহার:
 *
 * <ReportModal
 *   isOpen={showReportModal}
 *   onClose={() => setShowReportModal(false)}
 *   targetType="post"        // অথবা "comment"
 *   targetId={post.id}
 * />
 */
function ReportModal({ isOpen, onClose, targetType, targetId }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const resetAndClose = () => {
    setReason("");
    setDetails("");
    setSubmitted(false);
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = {
      reason,
      details,
      [targetType]: targetId, // { post: id } অথবা { comment: id }
    };

    try {
      await api.post("reports/", payload);
      setSubmitted(true);
    } catch (err) {
      const message =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Failed to submit report. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={resetAndClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6"
      >
        {submitted ? (
          // ================= SUCCESS STATE =================
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              Report Submitted
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Thank you for helping keep our community safe. Our team will
              review this shortly.
            </p>
            <button
              onClick={resetAndClose}
              className="w-full py-3 rounded-xl font-semibold text-white bg-rose-800 hover:bg-rose-900 dark:bg-rose-600 dark:hover:bg-rose-500 transition"
            >
              Close
            </button>
          </div>
        ) : (
          // ================= FORM STATE =================
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                🚩 Report {targetType === "comment" ? "Comment" : "Post"}
              </h3>

              <button
                type="button"
                onClick={resetAndClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2 text-slate-700 dark:text-slate-200 text-sm">
                Why are you reporting this?
              </label>

              <div className="space-y-2">
                {REPORT_REASONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition text-sm ${
                      reason === option.value
                        ? "border-rose-700 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:border-rose-600 dark:text-rose-300"
                        : "border-slate-300 text-slate-700 hover:border-rose-400 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={option.value}
                      checked={reason === option.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-rose-700"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2 text-slate-700 dark:text-slate-200 text-sm">
                Additional details (optional)
              </label>

              <textarea
                rows="3"
                maxLength={500}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any extra context that could help our review..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 resize-none text-sm bg-white text-slate-900 focus:ring-2 focus:ring-rose-800 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="flex-1 py-3 rounded-xl font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-3 rounded-xl font-semibold text-white transition ${
                  submitting
                    ? "bg-slate-400 cursor-not-allowed dark:bg-slate-700"
                    : "bg-rose-800 hover:bg-rose-900 dark:bg-rose-600 dark:hover:bg-rose-500"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReportModal;