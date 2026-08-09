import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

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
        setNotifications(
          response.data.results || response.data
        );
      })
      .catch((error) => {
        console.error(error.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // poll unread count every 30s
  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(loadUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // close dropdown on outside click
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
      document.removeEventListener("mousedown", handleClickOutside);
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
        prev.map((n) => ({ ...n, is_read: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        await api.post(`notifications/${notification.id}/read/`);

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error(error.response?.data);
      }
    }

    setOpen(false);

    if (notification.post_slug) {
      navigate(`/posts/${notification.post_slug}`);
    }
  };

  const getMessage = (notification) => {
    if (notification.notification_type === "like") {
      return (
        <>
          <span className="font-semibold">
            {notification.sender_username}
          </span>{" "}
          liked your post{" "}
          <span className="font-semibold">
            "{notification.post_title}"
          </span>
        </>
      );
    }

    if (notification.notification_type === "comment") {
      return (
        <>
          <span className="font-semibold">
            {notification.sender_username}
          </span>{" "}
          commented on{" "}
          <span className="font-semibold">
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
    return "🔔";
  };

  return (
    <div className="relative" ref={dropdownRef}>

      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        title="Notifications"
      >
        <svg
          className="w-6 h-6 text-gray-700"
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

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">

          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="font-bold text-gray-800">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">

            {loading ? (
              <div className="py-10 flex justify-center">
                <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-5 py-4 border-b last:border-b-0 flex gap-3 items-start hover:bg-gray-50 transition ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="text-xl leading-none mt-0.5">
                    {getIcon(notification.notification_type)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">
                      {getMessage(notification)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {timeAgo(notification.created_at)}
                    </p>
                  </div>

                  {!notification.is_read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></span>
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