const fs = require("fs");
const path = require("path");

const raw = fs.readFileSync(
  path.resolve(__dirname, "../../small_businesses_no_website.csv"),
  "utf-8"
);

function parseCSV(text) {
  const lines = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') { inQ = !inQ; cur += ch; }
    else if (ch === "\n" && !inQ) { lines.push(cur.replace(/\r$/, "")); cur = ""; }
    else cur += ch;
  }
  if (cur.trim()) lines.push(cur.replace(/\r$/, ""));
  const hdr = splitRow(lines[0]);
  return lines.slice(1).filter(Boolean).map((l) => {
    const v = splitRow(l);
    const o = {};
    hdr.forEach((h, i) => { o[h] = v[i] || ""; });
    return o;
  });
}

function splitRow(line) {
  const f = [];
  let c = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') q = !q;
    else if (ch === "," && !q) { f.push(c); c = ""; }
    else c += ch;
  }
  f.push(c);
  return f;
}

const rows = parseCSV(raw);
const leads = rows.map((r, i) => ({
  id: "lead_" + (i + 1),
  name: r.Business_Name || "Unknown",
  email: "",
  phone: r.Phone || "",
  company: r.Category || "",
  status: "new",
  source: "cold_call",
  value: 0,
  notes: [
    r.City && r.State ? r.City + ", " + r.State : "",
    r.Address || "",
    r.Rating ? "Rating: " + r.Rating + "/5 (" + (r.Review_Count || 0) + " reviews)" : "",
    r.Google_Maps_URL ? "Maps: " + r.Google_Maps_URL : "",
  ].filter(Boolean).join("\n"),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const outPath = path.resolve(__dirname, "../data/leads.json");
fs.writeFileSync(outPath, JSON.stringify(leads, null, 2));
console.log("Wrote " + leads.length + " leads to " + outPath);
