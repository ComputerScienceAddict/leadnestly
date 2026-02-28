"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { useLeads } from "@/hooks/useLeads";
import { useLeadStatus } from "@/hooks/useLeadStatus";
import { Phone, Building2, MapPin, Star, Calendar, Lock, CheckCircle, XCircle } from "lucide-react";
import UserMenu from "@/components/UserMenu";

export default function LeadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { leads, isLoaded } = useLeads();
  const { markLead, getStatus } = useLeadStatus();

  const currentIndex = leads.findIndex((l) => l.id === id);
  const lead = leads[currentIndex];

  const [resolved, setResolved] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const existingResult = getStatus(id);

  useEffect(() => {
    if (existingResult) setResolved(true);
  }, [existingResult]);

  // Block browser back button / backspace navigation
  useEffect(() => {
    if (resolved || existingResult) return;

    // Push a dummy history entry so pressing back stays on this page
    window.history.pushState(null, "", window.location.href);

    function onPopState() {
      // Re-push so they can never actually go back
      window.history.pushState(null, "", window.location.href);
      setShowWarning(true);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [resolved, existingResult]);

  // Block tab close / refresh
  useEffect(() => {
    if (resolved || existingResult) return;

    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [resolved, existingResult]);

  if (!isLoaded) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 14, color: "#999" }}>Loading lead…</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "#999", marginBottom: 16 }}>Lead not found.</p>
          <button onClick={() => router.push("/")} className="btn-teal">Back to Leads</button>
        </div>
      </div>
    );
  }

  const date = new Date(lead.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const noteLines = (lead.notes || "").split("\n").filter(Boolean);
  const location = noteLines.find((n) => !n.startsWith("Rating:"));
  const ratingLine = noteLines.find((n) => n.startsWith("Rating:"));

  async function handleInterested() {
    await markLead(id, "interested");
    setResolved(true);
  }

  async function handleNotInterested() {
    await markLead(id, "not_interested");
    setResolved(true);
  }

  function handleBack() {
    if (!resolved && !existingResult) {
      setShowWarning(true);
      return;
    }
    router.push("/");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #3c4043, #4a4f54)",
        borderBottom: "3px solid #e65100",
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", padding: "0 20px",
          height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Lock size={16} style={{ color: "#e65100" }} />
            <span style={{
              fontFamily: "'Nunito', Arial, sans-serif",
              fontWeight: 800, fontSize: 16, color: "#fff",
            }}>
              Locked into lead — call before leaving
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <UserMenu />
            <button
            onClick={handleBack}
            style={{
              background: resolved ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
              border: "none", borderRadius: 4,
              padding: "8px 16px", cursor: "pointer",
              fontSize: 13, fontWeight: 700, color: resolved ? "#fff" : "rgba(255,255,255,0.3)",
              fontFamily: "'Nunito', Arial, sans-serif",
            }}
          >
            {resolved ? "Back to Leads" : "Locked"}
          </button>
          </div>
        </div>
      </div>

      {/* Call action bar */}
      {!resolved && (
        <div style={{
          background: "#fff8e1", borderBottom: "1px solid #ffe082",
          padding: "14px 20px",
        }}>
          <div style={{
            maxWidth: 900, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, flexWrap: "wrap",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#e65100", fontFamily: "'Nunito', Arial, sans-serif" }}>
                Call this lead now
              </div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                {lead.phone ? (
                  <>Dial <strong style={{ color: "#333" }}>{lead.phone}</strong> then mark the result below</>
                ) : (
                  <>No phone number on file — mark the result below</>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleInterested}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 20px", borderRadius: 4,
                  background: "#27ae60", border: "none",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Nunito', Arial, sans-serif",
                }}
              >
                <CheckCircle size={16} /> Yes — Interested
              </button>
              <button
                onClick={handleNotInterested}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 20px", borderRadius: 4,
                  background: "#c0392b", border: "none",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Nunito', Arial, sans-serif",
                }}
              >
                <XCircle size={16} /> Not Interested
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result banner */}
      {resolved && (
        <div style={{
          background: existingResult === "not_interested" || (!existingResult && resolved) ? "#fdf2f2" : "#f0faf7",
          borderBottom: "1px solid",
          borderColor: (existingResult === "not_interested") ? "#f5c6c6" : "#b8d9be",
          padding: "14px 20px",
        }}>
          <div style={{
            maxWidth: 900, margin: "0 auto",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            {(existingResult === "interested" || (resolved && !existingResult)) ? (
              <>
                <CheckCircle size={18} style={{ color: "#27ae60" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e7e34", fontFamily: "'Nunito', Arial, sans-serif" }}>
                  Marked as Interested — lead is claimed.
                </span>
              </>
            ) : (
              <>
                <XCircle size={18} style={{ color: "#c0392b" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#c0392b", fontFamily: "'Nunito', Arial, sans-serif" }}>
                  Marked as Not Interested — lead is closed.
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Lead card */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 20px 40px" }}>
        <div className="panel" style={{ overflow: "hidden" }}>

          {/* Top section */}
          <div style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#e8f5f2",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#4db8a4" }}>
                  {lead.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 style={{
                  fontSize: 22, fontWeight: 800, color: "#333",
                  fontFamily: "'Nunito', Arial, sans-serif", margin: 0,
                }}>
                  {lead.name}
                </h1>
                {lead.company && (
                  <div style={{ fontSize: 14, color: "#999", marginTop: 2 }}>{lead.company}</div>
                )}
              </div>
            </div>
            <StatusBadge status={lead.status} />
          </div>

          {/* Info grid */}
          <div style={{
            padding: "20px 28px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 40px",
          }}>
            {lead.phone && (
              <InfoItem icon={<Phone size={15} />} label="Phone" value={lead.phone} highlight />
            )}
            {lead.company && (
              <InfoItem icon={<Building2 size={15} />} label="Category" value={lead.company} />
            )}
            {location && (
              <InfoItem icon={<MapPin size={15} />} label="Location" value={location} />
            )}
            {ratingLine && (
              <InfoItem icon={<Star size={15} />} label="Rating" value={ratingLine.replace("Rating: ", "")} />
            )}
            <InfoItem icon={<Calendar size={15} />} label="Added" value={date} />
          </div>

          {/* Notes */}
          {lead.notes && (
            <div style={{
              margin: "0 28px 20px", padding: "14px 16px",
              background: "#fafafa", border: "1px solid #eee", borderRadius: 4,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", marginBottom: 6 }}>
                Notes
              </div>
              <p style={{ fontSize: 13, color: "#555", whiteSpace: "pre-wrap", margin: 0, lineHeight: 1.6 }}>
                {lead.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #e8e8e8",
        padding: "14px 0", textAlign: "center",
        fontSize: 12, color: "#ccc",
      }}>
        LeadNestly &copy; {new Date().getFullYear()}
      </div>

      {/* Warning modal — tried to leave without marking */}
      {showWarning && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.55)",
        }}>
          <div className="panel" style={{ width: 400, overflow: "hidden" }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #eee",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <Lock size={20} style={{ color: "#e65100", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#333", fontFamily: "'Nunito', Arial, sans-serif" }}>
                  You&apos;re locked in
                </div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                  You must call and mark the result first.
                </div>
              </div>
            </div>
            <div style={{ padding: "16px 24px" }}>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: 0 }}>
                You cannot leave this page until you mark this lead as
                <strong> &quot;Interested&quot;</strong> or <strong>&quot;Not Interested&quot;</strong>.
                Please make the call and then select an outcome above.
              </p>
            </div>
            <div style={{
              borderTop: "1px solid #eee", padding: "14px 24px",
              display: "flex", justifyContent: "flex-end",
            }}>
              <button onClick={() => setShowWarning(false)} className="btn-teal">
                OK, I&apos;ll Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ color: highlight ? "#4db8a4" : "#bbb", marginTop: 2, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.3px" }}>
          {label}
        </div>
        <div style={{
          fontSize: highlight ? 16 : 14,
          fontWeight: highlight ? 800 : 400,
          color: highlight ? "#333" : "#444",
          marginTop: 2,
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}
