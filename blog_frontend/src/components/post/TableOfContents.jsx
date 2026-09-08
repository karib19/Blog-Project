import { useEffect, useState } from "react";

export function injectHeadingIds(html) {
  if (!html) {
    return {
      html: "",
      headings: [],
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const headingElements = doc.querySelectorAll("h1, h2, h3");

  const headings = [];
  const usedIds = new Set();

  headingElements.forEach((heading) => {
    const text = heading.textContent?.trim();


    if (!text) {
      heading.remove();
      return;
    }

    // Create URL-friendly ID from heading text
    let baseId = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");


    if (!baseId) {
      baseId = `heading-${headings.length + 1}`;
    }

    // Make sure IDs are unique
    let id = baseId;
    let counter = 2;

    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }

    usedIds.add(id);

    heading.id = id;

    headings.push({
      id,
      text,
      level: Number(heading.tagName.substring(1)),
    });
  });

  return {
    html: doc.body.innerHTML,
    headings,
  };
}

function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const updateActiveHeading = () => {
      const scrollPosition = window.scrollY + 140;

      let currentId = headings[0].id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);

        if (!element) continue;

        const elementTop =
          element.getBoundingClientRect().top + window.scrollY;

        if (elementTop <= scrollPosition) {
          currentId = heading.id;
        } else {
          break;
        }
      }

      setActiveId(currentId);
    };

    // Defer the initial update so it does not synchronously cascade from the effect.
    const initialUpdate = window.requestAnimationFrame(updateActiveHeading);

    window.addEventListener("scroll", updateActiveHeading, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.cancelAnimationFrame(initialUpdate);
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headings]);

  if (headings.length < 2) {
    return null;
  }

  const handleClick = (id) => {
    const element = document.getElementById(id);

    if (!element) return;

    // Immediately make clicked heading active
    setActiveId(id);

    const headerOffset = 100;

    const elementTop =
      element.getBoundingClientRect().top + window.scrollY;

    const targetPosition = Math.max(
      0,
      elementTop - headerOffset
    );

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <h3
        className="mb-5 w-full min-w-0 max-w-full text-lg font-semibold text-slate-900 dark:text-white"
        style={{
          fontFamily: "var(--font-serif, serif)",
        }}
      >
        📑 On This Page
      </h3>

      {/* Navigation */}
      <nav className="w-full min-w-0 max-w-full overflow-hidden border-l border-slate-200 dark:border-slate-800">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;

          return (
            <button
              key={heading.id}
              type="button"
              onClick={() => handleClick(heading.id)}
              className={`
                block
                w-full
                min-w-0
                max-w-full
                border-l-2
                -ml-px
                py-2
                text-left
                text-sm
                leading-5
                transition-colors
                whitespace-normal
                wrap-break-words
                [wrap-anywhere]

                ${isActive
                  ? "border-rose-500 font-semibold text-rose-500 dark:border-rose-400 dark:text-rose-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }
              `}
              style={{
                paddingLeft: `${Math.max(
                  12,
                  (heading.level - 1) * 12 + 16
                )}px`,
              }}
            >
              {heading.text}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default TableOfContents;