import "dotenv/config";
import express from "express";
import cors from "cors";

import apiRoutes from "./routes/apis";
import emailRoutes from "./routes/emails";
import logRoutes from "./routes/logs";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/apis", apiRoutes);
app.use("/emails", emailRoutes);
app.use("/logs", logRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
