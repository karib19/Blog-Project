import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function timeAgo(dateString) {
  const seconds = Math.floor(
    (new Date() - new Date(dateString)) / 1000
  );

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString();
}

function NotificationBell() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadUnreadCount = () => {
    api
      .get("notifications/unread-count/")
      .then((response) => {
        setUnreadCount(response.data.unread_count || 0);
      })
      .catch((error) => {
        console.error(error.response?.data);
      });
  };

  const loadNotifications = () => {
    setLoading(true);

    api
      .get("notifications/")
      .then((response) => {
        setNotifications(response.data.results || response.data);
      })
      .catch((error) => {
        console.error(error.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  useEffect(() => {
  loadUnreadCount();
}, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);

    if (next) {
      loadNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post("notifications/mark-all-read/");

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(error.response?.data);
    }
  };

const handleNotificationClick = async (notification) => {
  if (!notification.is_read) {
    try {
      await api.post(
        `notifications/${notification.id}/read/`
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, is_read: true }
            : n
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error.response?.data);
    }
  }

  setOpen(false);

  if (notification.notification_type === "follow") {
    navigate(`/author/${notification.sender_username}`);
  } else if (notification.post_slug) {
    navigate(`/posts/${notification.post_slug}`);
  }
};

const getMessage = (notification) => {
  if (notification.notification_type === "like") {
    return (
      <>
        <span className="font-semibold text-slate-900 dark:text-white">
          {notification.sender_username}
        </span>{" "}
        liked your post{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          "{notification.post_title}"
        </span>
      </>
    );
  }

  if (notification.notification_type === "comment") {
    return (
      <>
        <span className="font-semibold text-slate-900 dark:text-white">
          {notification.sender_username}
        </span>{" "}
        commented on{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          "{notification.post_title}"
        </span>
      </>
    );
  }

  if (notification.notification_type === "follow") {
    return (
      <>
        <span className="font-semibold text-slate-900 dark:text-white">
          {notification.sender_username}
        </span>{" "}
        started following you
      </>
    );
  }

  if (notification.notification_type === "new_post") {
    return (
      <>
        <span className="font-semibold text-slate-900 dark:text-white">
          {notification.sender_username}
        </span>{" "}
        published a new post{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          "{notification.post_title}"
        </span>
      </>
    );
  }

  return "New notification";
};

const getIcon = (type) => {
  if (type === "like") return "❤️";
  if (type === "comment") return "💬";
  if (type === "follow") return "👤";
  if (type === "new_post") return "📝";
  return "🔔";
};

  return (
    <div
      className="relative flex items-center"
      ref={dropdownRef}
    >
      {/* Notification Button */}
      <button
        onClick={handleToggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-rose-800 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-400"
        title="Notifications"
        aria-label="Notifications"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-700 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-slate-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {open && (
        <div
          className="
            absolute
            right-0
            top-12
            z-100
            w-[calc(100vw-2rem)]
            max-w-sm
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-xl
            sm:w-80
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800 dark:bg-rose-950/40 dark:text-rose-400">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-rose-800 transition hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[min(24rem,70vh)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-rose-800 dark:border-slate-700 dark:border-t-rose-400"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="mb-2 text-3xl">🔔</div>

                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  No notifications yet
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(notification)
                  }
                  className={`
                    flex
                    w-full
                    items-start
                    gap-3
                    border-b
                    border-slate-100
                    px-4
                    py-3.5
                    text-left
                    transition
                    last:border-b-0
                    hover:bg-slate-50
                    dark:border-slate-800
                    dark:hover:bg-slate-800
                    ${
                      !notification.is_read
                        ? "bg-rose-50/70 dark:bg-rose-950/20"
                        : "bg-white dark:bg-slate-900"
                    }
                  `}
                >
                  {/* Type Icon */}
                  <span
                    className={`
  flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base
  ${
    notification.notification_type === "like"
      ? "bg-rose-50 dark:bg-rose-950/40"
      : notification.notification_type === "follow"
      ? "bg-blue-50 dark:bg-blue-950/40"
      : notification.notification_type === "new_post"
      ? "bg-emerald-50 dark:bg-emerald-950/40"
      : "bg-slate-100 dark:bg-slate-800"
  }
`}
                  >
                    {getIcon(
                      notification.notification_type
                    )}
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-slate-700 dark:text-slate-300">
                      {getMessage(notification)}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      {timeAgo(notification.created_at)}
                    </p>
                  </div>

                  {/* Unread Dot */}
                  {!notification.is_read && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rose-700 dark:bg-rose-400"></span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;