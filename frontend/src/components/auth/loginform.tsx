import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function LoginForm() {
  const navigate = useNavigate();

  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      officerId.toUpperCase() === "SPVIJAY" &&
      password === "crimevista123"
    ) {
      navigate({ to: "/" });
      return;
    }

    setError("Invalid Officer ID or Password");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-6">

      <div className="panel w-full max-w-md p-8">

        <div className="text-center">

          <h1 className="text-3xl font-bold">
            Officer Login
          </h1>

          <p className="text-secondary mt-2">
            Karnataka State Police
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5 mt-8"
        >

          {/* Officer ID */}

          <div>

            <label className="block text-sm mb-2">
              Officer ID
            </label>

            <div className="relative">

              <User className="absolute left-3 top-3.5 w-5 h-5 text-secondary" />

              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="Enter Officer ID"
                className="w-full rounded-lg bg-secondary border border-border pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="block text-sm mb-2">
              Password
            </label>

            <div className="relative">

              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-secondary" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full rounded-lg bg-secondary border border-border pl-11 pr-12 py-3 outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-secondary"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

            </div>

          </div>

          {/* Remember */}

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2">

              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
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

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold transition hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

        <div className="mt-8 text-center text-xs text-secondary">

          <p>Demo Credentials</p>

          <p className="mt-2 font-mono">
            SPVIJAY / crimevista123
          </p>

        </div>

      </div>

    </div>
  );
}