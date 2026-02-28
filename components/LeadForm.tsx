"use client";

import { useState } from "react";
import { Lead, LeadFormData, LeadStatus, LeadSource } from "@/types/lead";
import { ALL_STATUSES, ALL_SOURCES, STATUS_CONFIG, SOURCE_LABELS } from "@/lib/constants";
import { X } from "lucide-react";

interface LeadFormProps {
  initial?: Lead;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
}

const EMPTY: LeadFormData = {
  name: "", email: "", phone: "", company: "",
  status: "new", source: "website", value: 0, notes: "",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 700,
  color: "#888", marginBottom: 4,
  fontFamily: "'Nunito', Arial, sans-serif",
};

export default function LeadForm({ initial, onSubmit, onCancel }: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>(
    initial
      ? { name: initial.name, email: initial.email, phone: initial.phone, company: initial.company, status: initial.status, source: initial.source, value: initial.value, notes: initial.notes }
      : EMPTY
  );
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  function validate() {
    const e: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.value < 0) e.value = "Must be 0 or more";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) { e.preventDefault(); if (validate()) onSubmit(form); }
  function field(key: keyof LeadFormData, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 150,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.45)",
    }}>
      <div className="panel" style={{ width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderBottom: "1px solid #eee",
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#333", fontFamily: "'Nunito', Arial, sans-serif" }}>
            {initial ? "Edit Lead" : "Add New Lead"}
          </span>
          <button onClick={onCancel} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#bbb", padding: 2, lineHeight: 1, display: "flex",
          }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>

            <div>
              <label style={labelStyle}>Full Name <span style={{ color: "#d9534f" }}>*</span></label>
              <input type="text" value={form.name} onChange={(e) => field("name", e.target.value)}
                placeholder="Jane Smith" style={{ width: "100%" }} className={errors.name ? "err" : ""} />
              {errors.name && <span style={{ fontSize: 11, color: "#d9534f" }}>{errors.name}</span>}
            </div>

            <div>
              <label style={labelStyle}>Email <span style={{ color: "#d9534f" }}>*</span></label>
              <input type="email" value={form.email} onChange={(e) => field("email", e.target.value)}
                placeholder="jane@company.com" style={{ width: "100%" }} className={errors.email ? "err" : ""} />
              {errors.email && <span style={{ fontSize: 11, color: "#d9534f" }}>{errors.email}</span>}
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => field("phone", e.target.value)}
                placeholder="+1 (555) 000-0000" style={{ width: "100%" }} />
            </div>

            <div>
              <label style={labelStyle}>Company</label>
              <input type="text" value={form.company} onChange={(e) => field("company", e.target.value)}
                placeholder="Acme Corp" style={{ width: "100%" }} />
            </div>

            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => field("status", e.target.value as LeadStatus)} style={{ width: "100%" }}>
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Source</label>
              <select value={form.source} onChange={(e) => field("source", e.target.value as LeadSource)} style={{ width: "100%" }}>
                {ALL_SOURCES.map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Deal Value ($)</label>
              <input type="number" min={0} value={form.value}
                onChange={(e) => field("value", parseFloat(e.target.value) || 0)}
                style={{ width: 180 }} className={errors.value ? "err" : ""} />
              {errors.value && <span style={{ fontSize: 11, color: "#d9534f", marginLeft: 8 }}>{errors.value}</span>}
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={(e) => field("notes", e.target.value)}
                placeholder="Any additional notes…" rows={3}
                style={{ width: "100%", resize: "vertical" }} />
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eee", marginTop: 16, paddingTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={onCancel} className="btn-gray">Cancel</button>
            <button type="submit" className="btn-teal">{initial ? "Save Changes" : "Add Lead"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
