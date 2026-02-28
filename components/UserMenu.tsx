"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{
        fontSize: 12, color: "rgba(255,255,255,0.8)",
        maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {user.email}
      </span>
      <button
        onClick={handleSignOut}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 4,
          background: "rgba(255,255,255,0.1)", border: "none",
          color: "#fff", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Nunito', Arial, sans-serif",
        }}
      >
        <LogOut size={12} /> Sign out
      </button>
    </div>
  );
}
