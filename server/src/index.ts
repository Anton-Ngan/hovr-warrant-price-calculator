import "dotenv/config";
import express from "express";
import cors from "cors";
import { buildHistory } from "./history.js";
import { getCurrent } from "./finnhub.js";
import { getLiveCache, startPoller } from "./poll.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN,
].filter((origin): origin is string => Boolean(origin));

app.use(cors({ origin: allowedOrigins }));

app.get("/api/history", (_req, res) => {
  res.json(buildHistory());
});

app.get("/api/current", async (_req, res) => {
    try {
      res.json(getLiveCache() ?? (await getCurrent()));
    } catch (err) {
      const message = err instanceof Error ? err.message : "quote failed";
      res.status(502).json({ error: message });
    }
  });

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

startPoller()