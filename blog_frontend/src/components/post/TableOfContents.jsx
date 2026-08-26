import { useEffect, useState } from "react";

function slugifyHeading(text, index) {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  return `${base || "section"}-${index}`;
}

export function injectHeadingIds(html) {
  if (!html) {
    return {
      html: "",
      headings: [],
    };
  }

  const container = document.createElement("div");
  container.innerHTML = html;

  const headingNodes = container.querySelectorAll("h1, h2, h3");

  const headings = [];

  headingNodes.forEach((node, index) => {
    const text = node.textContent || "";
    const id = slugifyHeading(text, index);

    node.id = id;

    headings.push({
      id,
      text,
      level: parseInt(node.tagName.replace("H", ""), 10),
    });
  });

  return {
    html: container.innerHTML,
    headings,
  };
}

function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -70% 0px",
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);

      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const handleClick = (id) => {
    const el = document.getElementById(id);

    if (el) {
      const y =
        el.getBoundingClientRect().top + window.scrollY - 90;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 dark:bg-slate-900 dark:border-slate-800">
      {/* Header */}

      <h3
        className="w-full min-w-0 max-w-full text-lg font-semibold text-slate-900 mb-4 dark:text-white"
        style={{
          fontFamily: "var(--font-serif, serif)",
        }}
      >
        📑 On This Page
      </h3>

      {/* Navigation */}

      <nav className="w-full min-w-0 max-w-full overflow-hidden space-y-1 border-l border-slate-200 dark:border-slate-800">
        {headings.map((heading) => (
          <button
            key={heading.id}
            type="button"
            onClick={() => handleClick(heading.id)}
            className={`block w-full min-w-0 max-w-full text-left text-sm py-1.5 border-l-2 -ml-px transition whitespace-normal break-words overflow-wrap-anywhere ${
              activeId === heading.id
                ? "border-rose-800 text-rose-800 font-semibold dark:border-rose-400 dark:text-rose-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
            style={{
              paddingLeft: `${(heading.level - 1) * 12 + 16}px`,
              overflowWrap: "anywhere",
            }}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default TableOfContents;