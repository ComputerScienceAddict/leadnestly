"use client";

import { Lead, LeadStatus, LeadSource } from "@/types/lead";
import { ALL_STATUSES, ALL_SOURCES, STATUS_CONFIG, SOURCE_LABELS } from "@/lib/constants";

interface SidebarProps {
  leads: Lead[];
  filterStatus: LeadStatus | "all";
  filterSource: LeadSource | "all";
  onFilterStatus: (v: LeadStatus | "all") => void;
  onFilterSource: (v: LeadSource | "all") => void;
}

export default function Sidebar({
  leads, filterStatus, filterSource, onFilterStatus, onFilterSource,
}: SidebarProps) {
  const total = leads.length;
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
  const wonCount = leads.filter((l) => l.status === "won").length;
  const hasFilters = filterStatus !== "all" || filterSource !== "all";

  return (
    <div className="panel" style={{ overflow: "hidden" }}>

      {/* Numbers row */}
      <div style={{
        display: "flex", borderBottom: "1px solid #f0f0f0",
      }}>
        <NumBlock label="Leads" value={String(total)} />
        <NumBlock label="Value" value={`$${totalValue.toLocaleString()}`} border />
        <NumBlock label="Won" value={String(wonCount)} accent border />
      </div>

      {/* Status pills */}
      <div style={{ padding: "12px 14px 8px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Pill
            label="All"
            active={filterStatus === "all"}
            onClick={() => onFilterStatus("all")}
          />
          {ALL_STATUSES.map((s) => {
            const count = leads.filter((l) => l.status === s).length;
            return (
              <Pill
                key={s}
                label={STATUS_CONFIG[s].label}
                count={count}
                dotClass={STATUS_CONFIG[s].dot}
                active={filterStatus === s}
                onClick={() => onFilterStatus(filterStatus === s ? "all" : s)}
              />
            );
          })}
        </div>
      </div>

      {/* Source filter */}
      <div style={{ padding: "10px 14px" }}>
        <select
          value={filterSource}
          onChange={(e) => onFilterSource(e.target.value as LeadSource | "all")}
          style={{
            width: "100%", fontSize: 13, padding: "6px 8px",
            border: "1px solid #eee", background: "#fafafa",
            color: filterSource === "all" ? "#aaa" : "#444",
          }}
        >
          <option value="all">All sources</option>
          {ALL_SOURCES.map((s) => (
            <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => { onFilterStatus("all"); onFilterSource("all"); }}
            style={{
              display: "block", marginTop: 8,
              background: "none", border: "none", cursor: "pointer",
              color: "#4db8a4", fontSize: 12,
              fontFamily: "'Nunito', Arial, sans-serif",
              padding: 0, fontWeight: 600,
            }}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function NumBlock({ label, value, accent, border }: {
  label: string; value: string; accent?: boolean; border?: boolean;
}) {
  return (
    <div style={{
      flex: 1, padding: "14px 10px", textAlign: "center",
      borderLeft: border ? "1px solid #f0f0f0" : "none",
    }}>
      <div style={{
        fontSize: 20, fontWeight: 800, color: accent ? "#4db8a4" : "#333",
        fontFamily: "'Nunito', Arial, sans-serif", lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Pill({ label, count, dotClass, active, onClick }: {
  label: string; count?: number; dotClass?: string;
  active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 10px",
        fontSize: 11, fontWeight: active ? 700 : 400,
        fontFamily: "'Nunito', Arial, sans-serif",
        color: active ? "#4db8a4" : "#888",
        background: active ? "#eef9f6" : "#fafafa",
        border: `1px solid ${active ? "#c5e8e0" : "#eee"}`,
        borderRadius: 20,
        cursor: "pointer",
        transition: "all 0.1s",
        whiteSpace: "nowrap",
      }}
    >
      {dotClass && (
        <span className={dotClass} style={{ width: 6, height: 6, borderRadius: "50%", display: "inline-block" }} />
      )}
      {label}
      {count !== undefined && count > 0 && (
        <span style={{ fontWeight: 700, color: active ? "#4db8a4" : "#bbb" }}>{count}</span>
      )}
    </button>
  );
}
