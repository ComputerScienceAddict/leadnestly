"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error, signedIn } = await signUp(email, password);
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    if (signedIn) {
      router.push("/");
      router.refresh();
      return;
    }

    setSuccess("Account created! Sign in now to continue.");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
          Create account
        </h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
          Sign up with your email to get started
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

          {success && (
            <div style={{
              padding: "12px 16px", marginBottom: 16,
              background: "#f0faf7", border: "1px solid #b8d9be",
              borderRadius: 4, fontSize: 13, color: "#1e7e34",
            }}>
              <div style={{ marginBottom: 8 }}>{success}</div>
              <Link href="/login" className="btn-teal" style={{ display: "inline-block", textDecoration: "none" }}>
                Sign in
              </Link>
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

          <label style={{ display: "block", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              style={{
                width: "100%", padding: "10px 12px",
                border: "1px solid #ddd", borderRadius: 4,
                fontSize: 14, fontFamily: "'Nunito', Arial, sans-serif",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#666", display: "block", marginBottom: 6 }}>Confirm password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
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
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p style={{ fontSize: 13, color: "#888", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#4db8a4", fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
