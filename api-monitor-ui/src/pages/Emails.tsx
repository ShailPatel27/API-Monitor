import { useEffect, useState } from "react";
import { getEmails, addEmail, deleteEmail } from "../api";

type EmailRow = {
  id: number;
  email: string;
  username?: string;
};

export default function Emails() {
  const [rows, setRows] = useState<EmailRow[]>([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  async function load() {
    const data = await getEmails();
    setRows(data);
  }

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  async function add() {
    if (!email) return;
    await addEmail(email, username || undefined);
    setEmail("");
    setUsername("");
    load();
  }

  async function remove(id: number, email: string) {
    if (!confirm(`Delete email?\n\n${email}`)) return;
    await deleteEmail(id);
    load();
  }

  return (
    <div>
      <h2>Email Recipients</h2>

      <div className="form-row">
        <input
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="Username (optional)"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button onClick={add}>Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.email}</td>
              <td>{r.username ?? "-"}</td>
              <td>
                <button
                  className="danger"
                  onClick={() => remove(r.id, r.email)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                No emails configured
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
