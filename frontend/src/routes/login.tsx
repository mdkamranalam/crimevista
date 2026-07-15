import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  User,
} from "lucide-react";

import kspLogo from "@/assets/ksp-logo.png";
import vidhanaSoudha from "@/assets/vidhana-soudha.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    setTimeout(() => {
      if (
        officerId.toUpperCase() === "SPVIJAY" &&
        password === "crimevista123"
      ) {
        navigate({ to: "/" });
      } else {
        setLoading(false);
        setError("Invalid Officer ID or Password");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">

      {/* LEFT */}

      <div className="hidden lg:flex flex-col justify-between bg-sidebar relative overflow-hidden p-12">

        <div className="absolute inset-0 bg-gradient-to-br from-[#08172B] via-[#10294D] to-[#0B1F3A]" />

        <div className="relative z-10">

          <div className="flex items-center gap-5">

            <img
              src={kspLogo}
              alt="Karnataka Police"
              className="w-20 h-20 object-contain"
            />

            <div>

              <h1 className="text-5xl font-black">

                <span className="text-white">
                  Crime
                </span>

                <span className="text-primary">
                  Vista
                </span>

              </h1>

              <p className="uppercase tracking-[0.3em] text-secondary text-sm mt-2">
                AI Crime Intelligence Platform
              </p>

              <p className="text-secondary text-sm">
                Government of Karnataka
              </p>

            </div>

          </div>

          <div className="mt-20">

            <h2 className="text-4xl font-bold text-white leading-tight">

              Secure.
              <br />
              Intelligent.
              <br />
              Effective.

            </h2>

            <p className="mt-6 text-secondary text-lg leading-8">

              Empowering Karnataka State Police with AI-powered
              crime analytics, hotspot detection, predictive
              policing and criminal relationship intelligence.

            </p>

            <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">

              <div className="flex items-center gap-3">

                <Shield className="text-primary w-6 h-6" />

                <div>

                  <h3 className="font-semibold text-white">
                    State Crime Records Bureau
                  </h3>

                  <p className="text-secondary text-sm mt-1">
                    Unified AI Crime Intelligence Platform
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="relative z-10">

          <img
            src={vidhanaSoudha}
            alt="Vidhana Soudha"
            className="w-[80%] mx-auto opacity-20"
          />

          <div className="border-t border-white/10 mt-6 pt-5 flex justify-between text-sm text-secondary">

            <span>Karnataka State Police</span>

            <span>CrimeVista v2.0</span>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center justify-center p-8">

        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-card rounded-2xl border border-border p-8 shadow-xl space-y-6"
        >          <div className="text-center">

            <div className="lg:hidden flex justify-center mb-5">

              <img
                src={kspLogo}
                alt="KSP"
                className="w-16 h-16 object-contain"
              />

            </div>

            <h2 className="text-3xl font-bold">
              Officer Login
            </h2>

            <p className="text-secondary mt-2">
              Welcome back. Sign in to continue.
            </p>

          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 p-3 text-sm">
              {error}
            </div>
          )}

          {/* Officer ID */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Officer ID
            </label>

            <div className="relative">

              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />

              <input
                required
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="SPVIJAY"
                className="w-full h-12 rounded-lg border border-border bg-background pl-11 pr-4 outline-none focus:border-primary"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Password
            </label>

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />

              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full h-12 rounded-lg border border-border bg-background pl-11 pr-12 outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-secondary" />
                ) : (
                  <Eye className="w-5 h-5 text-secondary" />
                )}
              </button>

            </div>

          </div>

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-yellow-500"
              />

              Remember Me

            </label>

            <button
              type="button"
              className="text-primary hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="rounded-lg border border-border p-4 bg-secondary/20">

            <h3 className="font-semibold text-primary mb-3">
              Demo Credentials
            </h3>

            <div className="flex justify-between text-sm">

              <span>Officer ID</span>

              <span className="font-mono">
                SPVIJAY
              </span>

            </div>

            <div className="flex justify-between text-sm mt-2">

              <span>Password</span>

              <span className="font-mono">
                crimevista123
              </span>

            </div>

          </div>

          <p className="text-center text-xs text-secondary">

            Karnataka State Police
            <br />
            State Crime Records Bureau

          </p>

        </form>

      </div>

    </div>

  );
}
