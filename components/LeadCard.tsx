"use client";

import { Lead } from "@/types/lead";
import { SOURCE_LABELS } from "@/lib/constants";
import StatusBadge from "./StatusBadge";
import { Mail, Phone, Building2, DollarSign } from "lucide-react";
import { useState } from "react";

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        textAlign: "left",
        background: "#fff",
        border: `1px solid ${hovered ? "#bdc7d8" : "#ddd"}`,
        boxShadow: hovered ? "0 1px 3px rgba(0,0,0,0.1)" : "0 1px 2px rgba(0,0,0,0.06)",
        padding: 0,
        cursor: "pointer",
        display: "block",
        fontFamily: "Arial, Helvetica, sans-serif",
        transition: "border-color 0.1s, box-shadow 0.1s",
      }}
    >
      {/* Name row */}
      <div style={{
        padding: "8px 10px 6px",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 8,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontWeight: "bold",
            fontSize: 13,
            color: hovered ? "#2d4373" : "#3b5998",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {lead.name}
          </div>
          {lead.company && (
            <div style={{
              fontSize: 11, color: "#888", marginTop: 1,
              display: "flex", alignItems: "center", gap: 3,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              <Building2 size={10} style={{ flexShrink: 0 }} />
              {lead.company}
            </div>
          )}
        </div>
        <StatusBadge status={lead.status} size="sm" />
      </div>

      {/* Details */}
      <div style={{ padding: "7px 10px 8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {lead.email && (
            <div style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <Mail size={11} style={{ color: "#bbb", flexShrink: 0 }} />
              <span style={{ color: "#3b5998" }}>{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 5 }}>
              <Phone size={11} style={{ color: "#bbb", flexShrink: 0 }} />
              {lead.phone}
            </div>
          )}
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 7, paddingTop: 6, borderTop: "1px solid #f3f3f3",
        }}>
          <span style={{ fontSize: 11, color: "#aaa" }}>{SOURCE_LABELS[lead.source]}</span>
          {lead.value > 0 && (
            <span style={{ fontSize: 12, fontWeight: "bold", color: "#4e9a06", display: "flex", alignItems: "center", gap: 1 }}>
              <DollarSign size={11} />{lead.value.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
