import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const SUPABASE_URL = "https://grssxeykqntnyotdyloh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdyc3N4ZXlrcW50bnlvdGR5bG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNzA3OTEsImV4cCI6MjA4NzY0Njc5MX0.z3cTkUAjQZ2zVHRW9G3BSGZA6-T5GBMRFykKFiZReLQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const csvPath = resolve("../small_businesses_no_website.csv");
const raw = readFileSync(csvPath, "utf-8");

function parseCSV(text) {
  const lines = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === "\n" && !inQuotes) {
      lines.push(current.replace(/\r$/, ""));
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current.replace(/\r$/, ""));

  const header = splitRow(lines[0]);
  return lines.slice(1).filter(Boolean).map((line) => {
    const vals = splitRow(line);
    const obj = {};
    header.forEach((h, i) => { obj[h] = vals[i] || ""; });
    return obj;
  });
}

function splitRow(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

const rows = parseCSV(raw);
console.log(`Parsed ${rows.length} rows from CSV`);

const leads = rows.map((r) => ({
  name: r.Business_Name || "Unknown",
  email: "",
  phone: r.Phone || "",
  company: r.Category || "",
  status: "new",
  source: "cold_call",
  value: 0,
  notes: [
    r.City && r.State ? `${r.City}, ${r.State}` : "",
    r.Address || "",
    r.Rating ? `Rating: ${r.Rating}/5 (${r.Review_Count || 0} reviews)` : "",
    r.Google_Maps_URL ? `Maps: ${r.Google_Maps_URL}` : "",
  ].filter(Boolean).join("\n"),
}));

const BATCH = 50;
let inserted = 0;
let errors = 0;

for (let i = 0; i < leads.length; i += BATCH) {
  const batch = leads.slice(i, i + BATCH);
  const { error } = await supabase.from("leads").insert(batch);
  if (error) {
    console.error(`Batch ${i}-${i + batch.length} failed:`, error.message);
    errors += batch.length;
  } else {
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${leads.length}`);
  }
}

console.log(`\nDone! ${inserted} inserted, ${errors} failed.`);
