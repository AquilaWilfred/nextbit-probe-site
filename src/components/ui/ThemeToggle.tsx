"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "dark";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (savedTheme === "system" && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.setAttribute("data-theme", shouldBeDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", newIsDark ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="4" fill="currentColor" />
          <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2.5" y1="2.5" x2="3.9" y2="3.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12.1" y1="12.1" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13.5" y1="2.5" x2="12.1" y2="3.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3.9" y1="12.1" x2="2.5" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.5 11.5C12 13.5 9.5 14.5 7 14.5C3.5 14.5 1 12 1 8.5C1 5.5 3 2.5 6 2C5.5 3 5.5 4.5 6.5 5.5C7.5 6.5 9 6.5 10 6C11.5 6 12.5 7 13 8C14 9.5 14 10.5 13.5 11.5Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
