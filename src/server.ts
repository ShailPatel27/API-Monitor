import app from "./app";
import "./scheduler";
import "./workers/monitor.worker";
import "./workers/email.worker";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
