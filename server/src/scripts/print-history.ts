import { buildHistory } from "../history.js";

const h = buildHistory();
console.log("points", h.length);
console.log("first", h[0]);
console.log("last", h[h.length - 1]);