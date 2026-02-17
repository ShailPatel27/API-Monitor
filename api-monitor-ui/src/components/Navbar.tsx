type Page = "apis" | "emails" | "logs";

export default function Navbar({
  page,
  setPage,
  theme,
  toggleTheme,
}: {
  page: Page;
  setPage: (p: Page) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}) {
  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <span className="navbar-title">API Monitor</span>

        <div className="navbar-links">
          {(["apis", "emails", "logs"] as Page[]).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`nav-btn ${page === p ? "active" : ""}`}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <button
        className="theme-btn"
        onClick={toggleTheme}
        title="Toggle light / dark mode"
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </nav>
  );
}
