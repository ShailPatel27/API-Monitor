import { useEffect, useState } from "react";
import { getNextMonitorRun, runMonitorNow } from "../api";

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

export default function MonitorStatus() {
  const [nextRunAt, setNextRunAt] = useState<number | null>(null);
  // eslint-disable-next-line react-hooks/purity
  const [now, setNow] = useState(Date.now());

  async function refreshNextRun() {
    const res = await getNextMonitorRun();
    setNextRunAt(res.nextRunAt);
  }

  useEffect(() => {
    refreshNextRun();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  async function manualHit() {
    await runMonitorNow();
    await refreshNextRun();
    alert("APIs called manually!");
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
        marginTop: 20,
      }}
    >
      <div>
        <strong>Next scheduled hit:</strong>{" "}
        {nextRunAt ? formatETA(nextRunAt - now) : "not scheduled"}
      </div>

      <button onClick={manualHit}>Manual Hit</button>
    </div>
  );
}
