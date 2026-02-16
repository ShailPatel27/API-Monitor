import { useEffect, useState } from "react";
import { getLogs } from "../api";

type LogRow = {
  id: number;
  project?: string;
  url: string;
  result: string;
  status_code?: number;
  status_text?: string;
  checked_at: string;
};

export default function Logs() {
  const [rows, setRows] = useState<LogRow[]>([]);

  async function load() {
    const data = await getLogs();
    setRows(data);
  }

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  return (
    <div>
      <h2>Execution Logs</h2>

      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>URL</th>
            <th>Result</th>
            <th>Status</th>
            <th>Checked At</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
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
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No logs available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
