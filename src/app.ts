import express from "express";
import cors from "cors";
import apiRoutes from "./routes/apis";
import emailRoutes from "./routes/emails";
import logRoutes from "./routes/logs";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/apis", apiRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/logs", logRoutes);

export default app;
