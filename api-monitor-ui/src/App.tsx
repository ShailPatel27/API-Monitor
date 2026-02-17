import { useEffect, useState } from "react";
import Apis from "./pages/Apis";
import Emails from "./pages/Emails";
import Logs from "./pages/Logs";
import { getNextMonitorRun, runMonitorNow } from "./api";

type Page = "apis" | "emails" | "logs";

function formatETA(ms: number) {
  if (ms <= 0) return "running soon";

  const total = Math.floor(ms / 1000);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);

  return `${h.toString().padStart(2, "0")}h ${m
    .toString()
    .padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

export default function App() {
  const [page, setPage] = useState<Page>("apis");
  const [nextRunAt, setNextRunAt] = useState<number | null>(null);
  // eslint-disable-next-line react-hooks/purity
  const [now, setNow] = useState(Date.now());

  // fetch next scheduled run
  async function refreshNextRun() {
    const res = await getNextMonitorRun();
    setNextRunAt(res.nextRunAt);
  }

  // initial load
  useEffect(() => {
    refreshNextRun();
  }, []);

  // ticking clock (frontend-only)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  async function manualHit() {
    await runMonitorNow();
    await refreshNextRun();
    alert("APIs called manually!")
  }

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("apis")}>APIs</button>
        <button onClick={() => setPage("emails")}>Emails</button>
        <button onClick={() => setPage("logs")}>Logs</button>
        <button onClick={manualHit}>Manual Hit</button>
      </nav>

      {/* ETA DISPLAY */}
      <div style={{ marginBottom: 15 }}>
        <strong>Next scheduled hit:</strong>{" "}
        {nextRunAt ? formatETA(nextRunAt - now) : "not scheduled"}
      </div>

      {page === "apis" && <Apis />}
      {page === "emails" && <Emails />}
      {page === "logs" && <Logs />}
    </div>
  );
}
