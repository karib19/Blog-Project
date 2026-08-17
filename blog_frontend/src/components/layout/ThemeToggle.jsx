import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
    >
      {isDark ? (
        <svg
          className="w-5 h-5 text-amber-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm9-6a1 1 0 010 2h-1a1 1 0 110-2h1zM4 12a1 1 0 010 2H3a1 1 0 110-2h1zm14.36-6.36a1 1 0 011.42 1.42l-.71.7a1 1 0 11-1.42-1.41l.71-.71zM6.34 17.66a1 1 0 011.42 1.42l-.71.7a1 1 0 11-1.42-1.41l.71-.71zM19.78 17.66l.71.71a1 1 0 01-1.42 1.41l-.7-.7a1 1 0 011.41-1.42zM6.34 6.34l-.71-.7a1 1 0 011.42-1.42l.7.71a1 1 0 11-1.41 1.41zM12 6a1 1 0 011-1v0a1 1 0 01-1 1zm0 12a1 1 0 011 1v0a1 1 0 01-1-1z" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-slate-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21.64 13.32A9 9 0 1110.68 2.36a1 1 0 01.99 1.67A7 7 0 1019.97 12.3a1 1 0 011.67.99z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
