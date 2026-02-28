const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "../data/leads.json");
const leads = JSON.parse(fs.readFileSync(file, "utf-8"));

let changed = 0;
for (const lead of leads) {
  if (!lead.notes) continue;
  const before = lead.notes;
  lead.notes = lead.notes
    .split("\n")
    .filter((line) => !line.startsWith("Maps:"))
    .join("\n");
  if (lead.notes !== before) changed++;
}

fs.writeFileSync(file, JSON.stringify(leads, null, 2));
console.log("Stripped Maps lines from " + changed + " of " + leads.length + " leads.");
