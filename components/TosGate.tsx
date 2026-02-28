"use client";

import { useState, useEffect } from "react";
import { TERMS_SECTIONS } from "@/lib/terms-content";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Status = "pending" | "accepted" | "declined" | "loading";

interface TosGateProps {
  children: React.ReactNode;
}

export default function TosGate({ children }: TosGateProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [checkbox, setCheckbox] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchAcceptance() {
      const sb = getSupabase();
      if (!sb) {
        setStatus("pending");
        return;
      }

      const { data } = await sb
        .from("terms_acceptances")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data?.status === "accepted") setStatus("accepted");
      else if (data?.status === "declined") setStatus("declined");
      else setStatus("pending");
    }

    fetchAcceptance();
  }, [user?.id]);

  async function accept() {
    if (!checkbox || !user) return;

    const sb = getSupabase();
    if (sb) {
      await sb.from("terms_acceptances").upsert(
        {
          user_id: user.id,
          status: "accepted",
          accepted_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
    setStatus("accepted");
  }

  async function decline() {
    if (!user) return;

    const sb = getSupabase();
    if (sb) {
      await sb.from("terms_acceptances").upsert(
        {
          user_id: user.id,
          status: "declined",
          accepted_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
    setStatus("declined");
  }

  async function resetToPending() {
    if (!user) return;

    const sb = getSupabase();
    if (sb) {
      await sb.from("terms_acceptances").delete().eq("user_id", user.id);
    }
    setStatus("pending");
  }

  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh", background: "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 14, color: "#999" }}>Loading…</div>
      </div>
    );
  }

  if (status === "accepted") return <>{children}</>;

  if (status === "declined") {
    return (
      <div style={{
        minHeight: "100vh", background: "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          maxWidth: 480, textAlign: "center", padding: 40,
          background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
        }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#333", marginBottom: 12, fontFamily: "'Nunito', Arial, sans-serif" }}>
            Sorry, can&apos;t show you the leads.
          </p>
          <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6 }}>
            Access to leads is only available after accepting the Terms of Service.
          </p>
          <button onClick={resetToPending} className="btn-teal" style={{ marginTop: 24 }}>
            View Terms Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#f5f5f5",
      padding: "24px 16px 40px", display: "flex", justifyContent: "center",
    }}>
      <div style={{
        maxWidth: 780, width: "100%",
        background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #3c4043, #4a4f54)",
          borderBottom: "3px solid #4db8a4",
          padding: "20px 28px",
        }}>
          <h1 style={{
            fontFamily: "'Nunito', Arial, sans-serif",
            fontWeight: 800, fontSize: 22, color: "#fff", margin: 0,
          }}>
            Terms of Service — Required Before Access
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>
            You must read and accept the complete terms below to access the lead database.
          </p>
        </div>

        {/* Terms content — long scrollable */}
        <div style={{
          padding: "28px 36px 24px", maxHeight: "60vh", overflowY: "auto",
          fontSize: 12.5, lineHeight: 1.65, color: "#333",
        }}>
          {TERMS_SECTIONS.map((section, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <h2 style={{
                fontSize: 11, fontWeight: 800, color: "#222",
                textTransform: "uppercase", letterSpacing: "0.5px",
                marginBottom: 10, borderBottom: "1px solid #ddd", paddingBottom: 4,
              }}>
                {section.heading}
              </h2>
              <div style={{ whiteSpace: "pre-wrap" }}>{section.content}</div>
            </div>
          ))}
          <p style={{ marginTop: 24, fontSize: 11, color: "#888" }}>
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Checkbox + Buttons */}
        <div style={{
          borderTop: "2px solid #eee",
          padding: "20px 36px",
          background: "#fafafa",
        }}>
          <label style={{
            display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
            marginBottom: 16, fontSize: 13, color: "#333",
          }}>
            <input
              type="checkbox"
              checked={checkbox}
              onChange={(e) => setCheckbox(e.target.checked)}
              style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
            />
            <span>
              I have read and agree to the complete Terms of Service above. I understand that <strong>50% of all Gross Revenue from Sales attributable to Leads</strong> must be paid to Joshua Anthony Juarez within fourteen (14) days of receipt, and I accept this obligation as a legally binding contract. I certify that I have the authority to enter into this Agreement.
            </span>
          </label>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button onClick={decline} className="btn-gray">
              Decline
            </button>
            <button
              onClick={accept}
              disabled={!checkbox}
              className="btn-teal"
              style={{
                opacity: checkbox ? 1 : 0.5,
                cursor: checkbox ? "pointer" : "not-allowed",
              }}
            >
              I Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
