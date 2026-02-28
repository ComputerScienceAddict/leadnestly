"use client";

import { Lead } from "@/types/lead";
import StatusBadge from "./StatusBadge";
import { CallResult } from "@/hooks/useLeadStatus";
import { ChevronRight, Lock, XCircle, CheckCircle } from "lucide-react";

interface LeadRowProps {
  lead: Lead;
  callResult?: CallResult;
  onClick: () => void;
}

export default function LeadRow({ lead, callResult, onClick }: LeadRowProps) {
  const date = new Date(lead.createdAt).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });

  const isNotInterested = callResult === "not_interested";
  const isInterested = callResult === "interested";
  const isClaimed = !!callResult;
  const isHidden = !isClaimed;

  // Only reveal first 3 chars in DOM for unclaimed leads — source code won't expose the rest
  const namePreview = isHidden ? lead.name.slice(0, 3) : lead.name;
  const subPreview = isHidden
    ? ([lead.company, lead.email].filter(Boolean)[0]?.slice(0, 3) ?? "—")
    : [lead.company, lead.email].filter(Boolean).join(" · ") || "—";
  const placeholder = "••••••••••••••••";

  return (
    <button
      onClick={isClaimed ? undefined : onClick}
      disabled={isClaimed}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        textAlign: "left",
        padding: "11px 16px",
        background: isNotInterested ? "#fdf2f2" : isInterested ? "#f0faf7" : "transparent",
        textDecoration: "none",
        borderBottom: "1px solid #f0f0f0",
        border: "none",
        borderBlockEnd: "1px solid #f0f0f0",
        cursor: isClaimed ? "default" : "pointer",
        fontFamily: "'Nunito', Arial, sans-serif",
        transition: "background 0.1s",
        opacity: isNotInterested ? 0.6 : 1,
      }}
      onMouseEnter={(e) => { if (!isClaimed) e.currentTarget.style.background = "#fafcfc"; }}
      onMouseLeave={(e) => { if (!isClaimed) e.currentTarget.style.background = "transparent"; }}
    >
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: isNotInterested ? "#fde8e8" : isInterested ? "#d4edda" : "#e8f5f2",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 13, fontWeight: 800,
          color: isNotInterested ? "#c0392b" : isInterested ? "#27ae60" : "#4db8a4",
        }}>
          {lead.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Name & company — only 3 chars in DOM when hidden, rest is placeholder */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700,
          color: isNotInterested ? "#999" : "#333",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          textDecoration: isNotInterested ? "line-through" : "none",
          userSelect: isHidden ? "none" : "auto",
        }}>
          {isHidden ? (
            <>
              <span>{namePreview}</span>
              <span style={{ filter: "blur(5px)", opacity: 0.8 }}>{placeholder}</span>
            </>
          ) : (
            lead.name
          )}
        </div>
        <div style={{
          fontSize: 12, color: "#999", marginTop: 1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          textDecoration: isNotInterested ? "line-through" : "none",
          userSelect: isHidden ? "none" : "auto",
        }}>
          {isHidden ? (
            <>
              <span>{subPreview}</span>
              <span style={{ filter: "blur(5px)", opacity: 0.8 }}>{placeholder}</span>
            </>
          ) : (
            [lead.company, lead.email].filter(Boolean).join(" · ") || "—"
          )}
        </div>
        {isHidden && (
          <div style={{
            fontSize: 11, color: "#4db8a4", fontWeight: 700, marginTop: 4,
            fontStyle: "italic",
          }}>
            Click to view this lead&apos;s information
          </div>
        )}
      </div>

      {/* Date */}
      <div style={{ fontSize: 12, color: "#aaa", flexShrink: 0, whiteSpace: "nowrap" }}>
        {date}
      </div>

      {/* Tag / Status */}
      <div style={{ flexShrink: 0 }}>
        {isNotInterested ? (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "2px 10px", fontSize: 11, fontWeight: 700,
            background: "#fde8e8", color: "#c0392b", borderRadius: 3,
            border: "1px solid #f5c6c6",
            fontFamily: "'Nunito', Arial, sans-serif",
          }}>
            <XCircle size={12} /> Not Interested
          </span>
        ) : isInterested ? (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "2px 10px", fontSize: 11, fontWeight: 700,
            background: "#d4edda", color: "#1e7e34", borderRadius: 3,
            border: "1px solid #b8d9be",
            fontFamily: "'Nunito', Arial, sans-serif",
          }}>
            <CheckCircle size={12} /> Interested
          </span>
        ) : (
          <StatusBadge status={lead.status} size="sm" />
        )}
      </div>

      {/* Right icon */}
      {isClaimed ? (
        <Lock size={13} style={{ color: "#ccc", flexShrink: 0 }} />
      ) : (
        <ChevronRight size={14} style={{ color: "#ccc", flexShrink: 0 }} />
      )}
    </button>
  );
}
