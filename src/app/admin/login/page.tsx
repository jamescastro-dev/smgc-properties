"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, LogIn, Building2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <main
      data-theme="admin"
      className="min-h-screen bg-luxury-900 flex items-center justify-center px-4"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)`,
        backgroundSize: "32px 32px",
      }}
    >
      {/* Subtle gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/25 mb-4">
            <Building2 className="w-5 h-5 text-gold-500" />
          </div>
          <h1 className="text-xl font-bold text-luxury-50 mb-0.5">Broker Shella</h1>
          <p className="text-gold-500/70 text-xs tracking-widest uppercase font-medium">
            SMGC Properties · Admin
          </p>
        </div>

        {/* Card */}
        <div className="bg-luxury-800 border border-luxury-700/80 rounded-2xl p-7 shadow-2xl shadow-black/40">
          <h2 className="text-luxury-50 text-lg font-bold mb-1">Welcome back</h2>
          <p className="text-luxury-500 text-sm mb-7">
            Sign in to manage your properties and leads.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5">
              <span className="text-red-400 text-sm leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-400 text-[11px] font-bold tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="shella@email.com"
                className="bg-luxury-900 border border-luxury-700 hover:border-gold-500/40 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-600 text-sm outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-luxury-400 text-[11px] font-bold tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-luxury-900 border border-luxury-700 hover:border-gold-500/40 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-600 text-sm outline-none transition-colors pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-luxury-500 hover:text-gold-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 disabled:opacity-60 disabled:cursor-not-allowed text-luxury-900 text-sm font-bold px-6 py-3.5 rounded-xl tracking-wide transition-colors duration-200 mt-1"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-luxury-900/30 border-t-luxury-900 rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>

          </form>
        </div>

        <p className="text-center text-luxury-600 text-xs mt-5">
          Private admin area. Unauthorized access is prohibited.
        </p>
      </div>
    </main>
  );
}
