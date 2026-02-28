"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import TosGate from "./TosGate";

const PUBLIC_PATHS = ["/login", "/signup"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (loading) return;
    if (isPublic) return;
    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, isPublic, router]);

  if (loading && !isPublic) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 14, color: "#999" }}>Loading…</div>
      </div>
    );
  }

  if (!user && !isPublic) {
    return null;
  }

  if (isPublic) {
    return <>{children}</>;
  }

  return <TosGate>{children}</TosGate>;
}
