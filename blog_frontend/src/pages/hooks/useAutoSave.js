import { useEffect, useRef, useState } from "react";

function useAutoSave(key, data, delay = 1500) {
  const [lastSaved, setLastSaved] = useState(null);
  const timeoutRef = useRef(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ data, savedAt: new Date().toISOString() })
        );
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, key, delay]);

  return { lastSaved };
}

export function loadDraft(key) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;

    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to load draft:", error);
    return null;
  }
}

export function clearDraft(key) {
  localStorage.removeItem(key);
}

export default useAutoSave;