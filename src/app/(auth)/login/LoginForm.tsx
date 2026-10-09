"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import styles from "./login.module.scss";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    if (!googleClientId || typeof window === "undefined") {
      return;
    }

    const scriptId = "google-gis-client";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initializeGoogle = () => {
      const google = (window as Window & { google?: any }).google;

      if (!google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: { credential?: string }) => {
          if (!response?.credential) {
            setError("Google sign-in did not return a credential.");
            return;
          }

          setError("");
          setLoading(true);

          try {
            const success = await loginWithGoogle(response.credential);
            if (success) {
              await new Promise((resolve) => setTimeout(resolve, 200));
            } else {
              setError("Google login failed. Please use an admin account.");
            }
          } finally {
            setLoading(false);
          }
        },
      });

      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "continue_with",
        shape: "rectangular",
      });

      setGoogleReady(true);
    };

    if (existingScript) {
      if ((window as Window & { google?: any }).google?.accounts?.id) {
        initializeGoogle();
      } else {
        existingScript.addEventListener("load", initializeGoogle, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => {
      setError("Unable to load Google sign-in.");
    };
    document.body.appendChild(script);
  }, [googleClientId, loginWithGoogle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // Wait a moment for auth state to update and cookie to be set
        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Extract error message from RTK Query error format
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "An error occurred. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className={styles.loginCard}>
            <h1 className={styles.title}>Login</h1>
            <p className="text-muted mb-4">
              Enter your credentials to access your account
            </p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.btn_login}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="my-3">
              <div className="text-center mb-2">
                <span className="text-muted small">Or continue with</span>
              </div>
              <div
                ref={googleButtonRef}
                aria-label="Continue with Google"
                className="w-100 d-flex justify-content-center"
              />
              {!googleReady && (
                <div className="text-center mt-2 text-muted small">
                  Loading Google sign-in...
                </div>
              )}
            </div>

            <div className="mt-3 text-center">
              <p className="text-muted small">
                Don't have an account?{" "}
                <Link href="/register">Register here</Link>
              </p>
            </div>

            <div className="mt-3 text-center">
              <p className="text-muted small">
                Forget Your Password{" "}
                <Link href="/forget-password">Forget Your Password</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
