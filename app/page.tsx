"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLeads } from "@/hooks/useLeads";
import { useLeadStatus } from "@/hooks/useLeadStatus";
import { Lead } from "@/types/lead";
import LeadRow from "@/components/LeadRow";
import { Search, X, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import UserMenu from "@/components/UserMenu";

const PAGE_SIZE = 20;

export default function HomePage() {
  const { leads, isLoaded, error } = useLeads();
  const { statuses, isClaimed } = useLeadStatus();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lockTarget, setLockTarget] = useState<Lead | null>(null);

  const filtered = search.trim()
    ? leads.filter((l) => {
        const q = search.toLowerCase();
        return (
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.phone.includes(q)
        );
      })
    : leads;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageLeads = filtered.slice(start, start + PAGE_SIZE);

  function handleSearchChange(val: string) {
    setSearch(val);
    setPage(1);
  }

  function handleLeadClick(lead: Lead) {
    if (isClaimed(lead.id)) return;
    setLockTarget(lead);
  }

  function confirmLock() {
    if (!lockTarget) return;
    router.push(`/lead/${lockTarget.id}`);
    setLockTarget(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #3c4043, #4a4f54)",
        borderBottom: "3px solid #4db8a4",
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", padding: "0 20px",
          height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "'Nunito', Arial, sans-serif",
            fontWeight: 800, fontSize: 22, color: "#fff",
            letterSpacing: "-0.3px",
          }}>
            Lead<span style={{ color: "#4db8a4" }}>Nestly</span>
          </span>
          <UserMenu />
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: "linear-gradient(135deg, #f9fafb, #eef5f3)",
        borderBottom: "1px solid #e0e0e0",
        padding: "28px 20px 32px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "'Nunito', Arial, sans-serif",
          fontSize: 26, fontWeight: 800, color: "#333",
          marginBottom: 6,
        }}>
          Your Leads
        </h1>
        <p style={{ fontSize: 14, color: "#aaa", fontStyle: "italic", marginBottom: 18 }}>
          Search by name, email, company, or phone
        </p>
        <div style={{ maxWidth: 520, margin: "0 auto", display: "flex" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} style={{
              position: "absolute", left: 14, top: "50%",
              transform: "translateY(-50%)", color: "#bbb", pointerEvents: "none",
            }} />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search..."
              style={{
                width: "100%", padding: "11px 36px 11px 40px",
                border: "1px solid #ddd", borderRadius: 4,
                fontSize: 15, fontFamily: "'Nunito', Arial, sans-serif",
                background: "#fff", color: "#333", outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#4db8a4"; }}
              onBlur={(e) => { e.target.style.borderColor = "#ddd"; }}
            />
            {search && (
              <button onClick={() => handleSearchChange("")} style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)", background: "none",
                border: "none", cursor: "pointer", color: "#bbb",
                padding: 0, lineHeight: 1, display: "flex",
              }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lead list */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 20px 40px" }}>

        {isLoaded && leads.length > 0 && (
          <div style={{
            display: "flex", alignItems: "baseline", justifyContent: "space-between",
            marginBottom: 10,
          }}>
            <span style={{ fontSize: 13, color: "#bbb" }}>
              {search
                ? <>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</>
                : <>{leads.length} lead{leads.length !== 1 ? "s" : ""}</>
              }
            </span>
            {totalPages > 1 && (
              <span style={{ fontSize: 13, color: "#bbb" }}>
                Page {safePage} of {totalPages}
              </span>
            )}
          </div>
        )}

        <div className="panel" style={{ overflow: "hidden" }}>
          {!isLoaded ? (
            <div style={{ padding: 16 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 0",
                  borderBottom: i < 3 ? "1px solid #f0f0f0" : "none",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#eee" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 12, background: "#eee", width: "45%", marginBottom: 6, borderRadius: 2 }} />
                    <div style={{ height: 10, background: "#f5f5f5", width: "30%", borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{ padding: "36px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#c0392b", marginBottom: 8 }}>Failed to load leads: {error}</p>
              <p style={{ fontSize: 13, color: "#888" }}>Check your Supabase config in .env.local</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "36px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#bbb" }}>
                {leads.length === 0
                  ? "No leads yet — they'll appear here once submitted."
                  : "No leads match your search."
                }
              </p>
            </div>
          ) : (
            pageLeads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                callResult={statuses[lead.id]}
                onClick={() => handleLeadClick(lead)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, marginTop: 16,
          }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: 4,
                background: safePage <= 1 ? "#f5f5f5" : "#fff",
                border: "1px solid #e0e0e0",
                cursor: safePage <= 1 ? "default" : "pointer",
                color: safePage <= 1 ? "#ccc" : "#555",
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {pageNumbers(safePage, totalPages).map((n, i) =>
              n === "..." ? (
                <span key={`dot-${i}`} style={{ fontSize: 13, color: "#bbb", padding: "0 4px" }}>…</span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n as number)}
                  style={{
                    minWidth: 36, height: 36, borderRadius: 4,
                    background: n === safePage ? "#4db8a4" : "#fff",
                    border: n === safePage ? "none" : "1px solid #e0e0e0",
                    color: n === safePage ? "#fff" : "#555",
                    fontWeight: n === safePage ? 700 : 400,
                    fontSize: 13, cursor: "pointer",
                    fontFamily: "'Nunito', Arial, sans-serif",
                  }}
                >
                  {n}
                </button>
              )
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: 4,
                background: safePage >= totalPages ? "#f5f5f5" : "#fff",
                border: "1px solid #e0e0e0",
                cursor: safePage >= totalPages ? "default" : "pointer",
                color: safePage >= totalPages ? "#ccc" : "#555",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #e8e8e8",
        padding: "14px 0", textAlign: "center",
        fontSize: 12, color: "#ccc",
      }}>
        LeadNestly &copy; {new Date().getFullYear()}
      </div>

      {/* Lock-in modal */}
      {lockTarget && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.5)",
        }}>
          <div className="panel" style={{ width: 420, overflow: "hidden" }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #eee",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#fff3e0",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Lock size={18} style={{ color: "#e65100" }} />
              </div>
              <div>
                <div style={{
                  fontSize: 16, fontWeight: 800, color: "#333",
                  fontFamily: "'Nunito', Arial, sans-serif",
                }}>
                  Lock into this lead?
                </div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                  You will be committed to calling this lead.
                </div>
              </div>
            </div>
            <div style={{ padding: "16px 24px" }}>
              <div style={{
                padding: "12px 16px", background: "#fafafa",
                border: "1px solid #eee", borderRadius: 4, marginBottom: 16,
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#333", userSelect: "none" }}>
                  <span>{lockTarget.name.slice(0, 3)}</span>
                  <span style={{ filter: "blur(5px)", opacity: 0.8 }}>••••••••••••••••</span>
                  <span style={{ marginLeft: 4 }}>·</span>
                  <span style={{ marginLeft: 4 }}>{[lockTarget.company, lockTarget.phone].filter(Boolean)[0]?.slice(0, 3) ?? "—"}</span>
                  <span style={{ filter: "blur(5px)", opacity: 0.8 }}>••••••••••••••••</span>
                </div>
                <div style={{ fontSize: 13, color: "#4db8a4", fontWeight: 700, marginTop: 8 }}>
                  Click &quot;Lock In &amp; Call&quot; to view this lead&apos;s full information
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 0 }}>
                Once you lock in, you <strong>must call</strong> this lead and mark the outcome
                as <strong>&quot;Interested&quot;</strong> or <strong>&quot;Not Interested&quot;</strong> before
                you can leave. This lead will be tagged so no one else can claim it.
              </p>
            </div>
            <div style={{
              borderTop: "1px solid #eee", padding: "14px 24px",
              display: "flex", gap: 10, justifyContent: "flex-end",
            }}>
              <button onClick={() => setLockTarget(null)} className="btn-gray">
                Cancel
              </button>
              <button onClick={confirmLock} className="btn-teal">
                <Lock size={13} /> Lock In &amp; Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
