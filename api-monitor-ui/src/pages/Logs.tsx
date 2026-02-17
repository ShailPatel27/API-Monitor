import { useEffect, useMemo, useRef, useState } from "react";
import { getLogs } from "../api";
import MonitorStatus from "../components/MonitorStatus";

type LogRow = {
  id: number;
  project?: string;
  url: string;
  result: string;
  status_code?: number;
  status_text?: string;
  checked_at: string;
};

type DatePreset = "24h" | "7d" | "30d" | "all";
type SortDir = "asc" | "desc";

export default function Logs() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [search, setSearch] = useState("");

  // filters
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [customRange, setCustomRange] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // sorting
  const [sortKey, setSortKey] = useState<keyof LogRow | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // pagination
  const [visible, setVisible] = useState(100);

  const filterRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    getLogs().then(setRows);
  }, []);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!showFilters) return;

      const target = e.target as Node;

      if (
        filterRef.current &&
        !filterRef.current.contains(target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(target)
      ) {
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showFilters]);

  /* ---------------- derived ---------------- */

  const allProjects = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.project).filter(Boolean)),
      ) as string[],
    [rows],
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const text =
        `${r.project ?? ""} ${r.url} ${r.result} ${r.status_code ?? ""} ${r.status_text ?? ""}`.toLowerCase();

      if (!text.includes(search.toLowerCase())) return false;
      if (projects.length && !projects.includes(r.project ?? "")) return false;
      if (results.length && !results.includes(r.result)) return false;

      const time = new Date(r.checked_at).getTime();
      // eslint-disable-next-line react-hooks/purity
      const now = Date.now();

      if (!customRange) {
        if (datePreset === "24h" && now - time > 86400000) return false;
        if (datePreset === "7d" && now - time > 604800000) return false;
        if (datePreset === "30d" && now - time > 2592000000) return false;
      } else {
        if (start && time < new Date(start).getTime()) return false;
        if (end && time > new Date(end).getTime()) return false;
      }

      return true;
    });
  }, [rows, search, projects, results, datePreset, customRange, start, end]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const x = (a[sortKey] ?? "").toString();
      const y = (b[sortKey] ?? "").toString();
      return sortDir === "asc" ? x.localeCompare(y) : y.localeCompare(x);
    });
  }, [filtered, sortKey, sortDir]);

  const visibleRows = sorted.slice(0, visible);

  function toggleSort(key: keyof LogRow) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div style={{ position: "relative" }}>
      <MonitorStatus />
      <h2>Execution Logs</h2>

      {/* SEARCH + FILTER BUTTON */}
      <div className="form-row" style={{ alignItems: "center" }}>
        <input
          placeholder="Search logs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 10, minWidth: 300 }}
        />
        <button ref={filterButtonRef} onClick={() => setShowFilters((v) => !v)}>
          Filters
        </button>
      </div>

      {/* FILTER PANEL (OVERLAY) */}
      {showFilters && (
        <div ref={filterRef} className="filter-panel">
          
          <strong>Projects</strong>
          {allProjects.map((p) => (
            <label
              key={p}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <input
                type="checkbox"
                checked={projects.includes(p)}
                onChange={() =>
                  setProjects((v) =>
                    v.includes(p) ? v.filter((x) => x !== p) : [...v, p],
                  )
                }
              />
              {p}
            </label>
          ))}

          <hr />

          <strong>Result</strong>
          {["Success", "Failure", "Network or DNS Error"].map((r) => (
            <label
              key={r}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <input
                type="checkbox"
                checked={results.includes(r)}
                onChange={() =>
                  setResults((v) =>
                    v.includes(r) ? v.filter((x) => x !== r) : [...v, r],
                  )
                }
              />
              {r}
            </label>
          ))}

          <hr />

          <strong>Date Range</strong>
          {[
            ["24h", "Last 24 hours"],
            ["7d", "Last 7 days"],
            ["30d", "Last 30 days"],
            ["all", "All"],
          ].map(([v, label]) => (
            <label
              key={v}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <input
                type="radio"
                checked={!customRange && datePreset === v}
                onChange={() => {
                  setCustomRange(false);
                  setDatePreset(v as DatePreset);
                }}
              />
              {label}
            </label>
          ))}

          <button
            style={{ marginTop: 6 }}
            onClick={() => {
              setCustomRange(true);
              setDatePreset("all");
            }}
          >
            Custom range
          </button>

          {customRange && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginTop: 6,
              }}
            >
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                style={{ width: "90%" }}
              />
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                style={{ width: "90%" }}
              />
            </div>
          )}

          <hr />

          <button
            onClick={() => {
              setProjects([]);
              setResults([]);
              setCustomRange(false);
              setDatePreset("all");
              setStart("");
              setEnd("");
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            {[
              ["project", "Project"],
              ["url", "URL"],
              ["result", "Result"],
              ["status_text", "Status"],
              ["checked_at", "Checked At"],
            ].map(([k, label]) => (
              <th
                key={k}
                onClick={() => toggleSort(k as keyof LogRow)}
                style={{
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  userSelect: "none",
                }}
              >
                {label}
                {sortKey === k && (sortDir === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {visibleRows.map((r) => (
            <tr key={r.id}>
              <td>{r.project ?? "-"}</td>
              <td>{r.url}</td>
              <td>{r.result}</td>
              <td>
                {r.status_code
                  ? `${r.status_code} ${r.status_text ?? ""}`
                  : "-"}
              </td>
              <td>{new Date(r.checked_at).toLocaleString()}</td>
            </tr>
          ))}

          {visibleRows.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {visible < sorted.length && (
        <div className="viewMoreContainer" style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <button className="viewMoreBtn" onClick={() => setVisible((v) => v + 10)}>+10</button>
          <button className="viewMoreBtn" onClick={() => setVisible((v) => v + 100)}>+100</button>
          <button className="viewMoreBtn" onClick={() => setVisible(sorted.length)}>All</button>
        </div>
      )}
    </div>
  );
}
