import { useEffect, useState } from "react";
import Apis from "./pages/Apis";
import Emails from "./pages/Emails";
import Logs from "./pages/Logs";
import Navbar from "./components/Navbar";

type Page = "apis" | "emails" | "logs";

export default function App() {
  const [page, setPage] = useState<Page>("apis");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <div style={{ padding: 20 }}>
      <Navbar
        page={page}
        setPage={setPage}
        theme={theme}
        toggleTheme={() =>
          setTheme(t => (t === "light" ? "dark" : "light"))
        }
      />

      {page === "apis" && <Apis />}
      {page === "emails" && <Emails />}
      {page === "logs" && <Logs />}
    </div>
  );
}
