"use client";

import { Lead } from "@/types/lead";
import { SOURCE_LABELS } from "@/lib/constants";
import StatusBadge from "./StatusBadge";
import { X, Pencil, Trash2, Mail, Phone, Building2, DollarSign, Calendar, Tag } from "lucide-react";

interface LeadDetailProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "6px 0",
    }}>
      <span style={{ color: "#ccc", marginTop: 1, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.3px" }}>{label}</div>
        <div style={{ fontSize: 14, color: "#444", marginTop: 1 }}>{value}</div>
      </div>
    </div>
  );
}

export default function LeadDetail({ lead, onEdit, onDelete, onClose }: LeadDetailProps) {
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 150,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.45)",
    }}>
      <div className="panel" style={{ width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderBottom: "1px solid #eee",
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#333", fontFamily: "'Nunito', Arial, sans-serif" }}>
            Lead Details
          </span>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#bbb", padding: 2, lineHeight: 1, display: "flex",
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Name block */}
        <div style={{
          padding: "16px", borderBottom: "1px solid #f0f0f0",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "#e8f5f2",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#4db8a4" }}>
                {lead.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#333", fontFamily: "'Nunito', Arial, sans-serif" }}>
                {lead.name}
              </div>
              {lead.company && (
                <div style={{ fontSize: 13, color: "#999", marginTop: 1 }}>{lead.company}</div>
              )}
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        {/* Info */}
        <div style={{ padding: "10px 16px" }}>
          <Row icon={<Mail size={14} />} label="Email" value={lead.email} />
          <Row icon={<Phone size={14} />} label="Phone" value={lead.phone} />
          <Row icon={<Building2 size={14} />} label="Company" value={lead.company} />
          <Row icon={<DollarSign size={14} />} label="Value" value={lead.value > 0 ? `$${lead.value.toLocaleString()}` : ""} />
          <Row icon={<Tag size={14} />} label="Source" value={SOURCE_LABELS[lead.source]} />
          <Row icon={<Calendar size={14} />} label="Added" value={fmt(lead.createdAt)} />

          {lead.notes && (
            <div style={{
              marginTop: 10, padding: "10px 12px",
              background: "#fafafa", border: "1px solid #eee",
              borderRadius: 3,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", marginBottom: 4 }}>Notes</div>
              <p style={{ fontSize: 13, color: "#555", whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.5 }}>{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          borderTop: "1px solid #eee", padding: "12px 16px",
          display: "flex", gap: 8, justifyContent: "flex-end",
        }}>
          <button onClick={onDelete} className="btn-red" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Trash2 size={13} /> Delete
          </button>
          <button onClick={onEdit} className="btn-teal" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Pencil size={13} /> Edit Lead
          </button>
        </div>
      </div>
    </div>
  );
}
