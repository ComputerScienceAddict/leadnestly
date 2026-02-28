const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabase = createClient(
  "https://grssxeykqntnyotdyloh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdyc3N4ZXlrcW50bnlvdGR5bG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNzA3OTEsImV4cCI6MjA4NzY0Njc5MX0.z3cTkUAjQZ2zVHRW9G3BSGZA6-T5GBMRFykKFiZReLQ"
);

async function main() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  const leads = data.map((r) => ({
    id: r.id,
    name: r.name || "",
    email: r.email || "",
    phone: r.phone || "",
    company: r.company || "",
    status: r.status || "new",
    source: r.source || "other",
    value: r.value || 0,
    notes: r.notes || "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  const outPath = path.resolve(__dirname, "../data/leads.json");
  fs.writeFileSync(outPath, JSON.stringify(leads, null, 2));
  console.log("Wrote " + leads.length + " leads to data/leads.json");
}

main();
