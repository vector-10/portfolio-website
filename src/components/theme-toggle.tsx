"use client";

export function ThemeToggle({ className = "", suffix = "" }: { className?: string; suffix?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("cb-theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      className={`cursor-pointer rounded-full border border-rule bg-transparent text-ink ${className}`}
    >
      <span className="when-light">Dark{suffix}</span>
      <span className="when-dark">Light{suffix}</span>
    </button>
  );
}
