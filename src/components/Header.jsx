import { useEffect, useState } from "react";

function getSystemThemePref() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Header() {
  const [theme, setTheme] = useState(localStorage.theme || getSystemThemePref());

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  function handleChange(e) {
    const changedTheme = e.target.checked ? "dark" : "light";
    setTheme(changedTheme);
    localStorage.theme = changedTheme;
  }

  return (
    <header>
      <img src="/img/invoice-app-head-icon.svg" alt="Invoice App Head Icon" />
      <div className="theme-avatar-icon">
        <label>
          {theme === "dark" ? <img src="/img/moon-icon-light-mode.svg" alt="Moon Icon" /> : <img src="/img/moon-icon-light-mode.svg" alt="Moon Icon" />}
          <input type="checkbox" defaultChecked={theme === "dark"} onChange={handleChange} />
        </label>
        <img src="/img/avatar-image.svg" alt="Avatar Image" />
      </div>
    </header>
  );
}