"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#f5f5f5",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
        padding: 32,
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{
            fontFamily: "'Nunito', Arial, sans-serif",
            fontWeight: 800, fontSize: 20, color: "#4db8a4",
            marginBottom: 24,
          }}>
            Lead<span style={{ color: "#3c4043" }}>Nestly</span>
          </div>
        </Link>
        <h1 style={{
          fontFamily: "'Nunito', Arial, sans-serif",
          fontSize: 24, fontWeight: 800, color: "#333", marginBottom: 8,
        }}>
          Sign in
        </h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
          Enter your email and password to access LeadNestly
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: "10px 12px", marginBottom: 16,
              background: "#fdf2f2", border: "1px solid #f5c6c6",
              borderRadius: 4, fontSize: 13, color: "#c0392b",
            }}>
              {error}
            </div>
          )}

          <label style={{ display: "block", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: "100%", padding: "10px 12px",
                border: "1px solid #ddd", borderRadius: 4,
                fontSize: 14, fontFamily: "'Nunito', Arial, sans-serif",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%", padding: "10px 12px",
                border: "1px solid #ddd", borderRadius: 4,
                fontSize: 14, fontFamily: "'Nunito', Arial, sans-serif",
                boxSizing: "border-box",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-teal"
            style={{ width: "100%", justifyContent: "center", marginBottom: 16 }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ fontSize: 13, color: "#888", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#4db8a4", fontWeight: 700 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
