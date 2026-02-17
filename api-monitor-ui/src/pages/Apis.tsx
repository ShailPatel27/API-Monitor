import { useEffect, useState } from "react";
import { getApis, addApi, deleteApi } from "../api";

type ApiRow = {
  id: number;
  project: string;
  url: string;
};

export default function Apis() {
  const [rows, setRows] = useState<ApiRow[]>([]);
  const [project, setProject] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    const data = await getApis();
    setRows(data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function add() {
    if (!project || !url) return;
    await addApi(project, url);
    setProject("");
    setUrl("");
    load();
  }

  async function remove(id: number, url: string) {
    if (!confirm(`Delete API?\n\n${url}`)) return;
    await deleteApi(id);
    load();
  }

  const filteredRows = rows.filter(r =>
    r.project.toLowerCase().includes(search.toLowerCase()) ||
    r.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Monitored APIs</h2>

      <div className="form-row">
        <input
          placeholder="Project"
          value={project}
          onChange={e => setProject(e.target.value)}
        />
        <input
          placeholder="API URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button onClick={add}>Add</button>
      </div>

      <input
        placeholder="Search by project or URL"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 10, width: 300 }}
      />

      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>URL</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map(r => (
            <tr key={r.id}>
              <td>{r.project}</td>
              <td>{r.url}</td>
              <td>
                <button
                  className="danger"
                  onClick={() => remove(r.id, r.url)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredRows.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                No matching APIs
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
