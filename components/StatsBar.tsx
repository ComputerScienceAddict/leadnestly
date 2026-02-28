import { Lead } from "@/types/lead";
import { STATUS_CONFIG, ALL_STATUSES } from "@/lib/constants";

interface StatsBarProps {
  leads: Lead[];
}

export default function StatsBar({ leads }: StatsBarProps) {
  const total = leads.length;
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
  const wonLeads = leads.filter((l) => l.status === "won");
  const wonValue = wonLeads.reduce((sum, l) => sum + l.value, 0);
  const activeStatuses = ALL_STATUSES.filter(
    (s) => leads.filter((l) => l.status === s).length > 0
  );

  if (total === 0) return null;

  return (
    <div className="box" style={{ padding: "10px 14px", marginBottom: 10 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        flexWrap: "wrap",
      }}>
        {/* Counts */}
        <span style={{ fontSize: 13, color: "#555" }}>
          <strong style={{ color: "#222", fontFamily: "'Nunito', Arial, sans-serif", fontSize: 15 }}>{total}</strong> lead{total !== 1 ? "s" : ""}
        </span>

        <Dot />

        <span style={{ fontSize: 13, color: "#555" }}>
          <strong style={{ color: "#222", fontFamily: "'Nunito', Arial, sans-serif", fontSize: 15 }}>${totalValue.toLocaleString()}</strong> pipeline
        </span>

        {wonLeads.length > 0 && (
          <>
            <Dot />
            <span style={{ fontSize: 13, color: "#4e9a06" }}>
              <strong style={{ fontFamily: "'Nunito', Arial, sans-serif", fontSize: 15 }}>{wonLeads.length}</strong> won
              <span style={{ color: "#888", fontSize: 12 }}> (${wonValue.toLocaleString()})</span>
            </span>
          </>
        )}

        {/* Status chips */}
        {activeStatuses.length > 0 && (
          <>
            <div style={{ width: 1, height: 16, background: "#ddd", margin: "0 12px", flexShrink: 0 }} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {activeStatuses.map((s) => {
                const count = leads.filter((l) => l.status === s).length;
                return (
                  <span key={s} style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    fontSize: 11, color: "#666",
                  }}>
                    <span className={STATUS_CONFIG[s].dot} style={{
                      width: 7, height: 7, borderRadius: "50%",
                      display: "inline-block", flexShrink: 0,
                    }} />
                    {STATUS_CONFIG[s].label} <strong style={{ color: "#333" }}>{count}</strong>
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span style={{
      display: "inline-block", width: 3, height: 3,
      borderRadius: "50%", background: "#ccc",
      margin: "0 10px", flexShrink: 0,
    }} />
  );
}
