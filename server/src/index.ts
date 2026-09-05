import "dotenv/config";
import express from "express";
import cors from "cors";
import { buildHistory } from "./history.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/api/history", (_req, res) => {
  res.json(buildHistory());
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`listening on ${port}`);
});