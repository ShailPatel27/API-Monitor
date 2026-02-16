import { useState } from "react";
import Apis from "./pages/Apis";
import Emails from "./pages/Emails";
import Logs from "./pages/Logs";

export default function App() {
  const [page, setPage] = useState<"apis" | "emails" | "logs">("apis");

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("apis")}>APIs</button>
        <button onClick={() => setPage("emails")}>Emails</button>
        <button onClick={() => setPage("logs")}>Logs</button>
      </nav>

      {page === "apis" && <Apis />}
      {page === "emails" && <Emails />}
      {page === "logs" && <Logs />}
    </div>
  );
}
