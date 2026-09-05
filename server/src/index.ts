import "dotenv/config";
import express from "express";
import cors from "cors";
import { buildHistory } from "./history.js";
import { getCurrent } from "./finnhub.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/api/history", (_req, res) => {
  res.json(buildHistory());
});

app.get("/api/current", async (_req, res) => {
    try {
      res.json(await getCurrent());
    } catch (err) {
      const message = err instanceof Error ? err.message : "quote failed";
      res.status(502).json({ error: message });
    }
  });

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`listening on ${port}`);
});