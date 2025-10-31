import express from "express";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";

import summaryRoute from "./routes/summary.js";
import demandRoute from "./routes/demand.js";
import revenueRoute from "./routes/revenue.js";
import recentSessionsRoute from "./routes/recentSessions.js";
import pendingPaymentsRoute from "./routes/pendingPayments.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// Optional: serve frontend files if placed in the same folder
app.use(express.static(__dirname));

// --- API routes ---
app.use("/api/summary", summaryRoute);
app.use("/api/demand", demandRoute);
app.use("/api/revenue", revenueRoute);
app.use("/api/recent-sessions", recentSessionsRoute);
app.use("/api/pending-payments", pendingPaymentsRoute);

// Optional: fallback route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
