"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Trash2,
  Plus,
  X,
} from "lucide-react";

interface Factor {
  id: string;
  friendly_name?: string;
  status: string;
}

export default function MfaSettingsClient() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);

  // Enrollment flow
  const [enrolling, setEnrolling] = useState(false);
  const [starting, setStarting] = useState(false);
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [pendingId, setPendingId] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadFactors = useCallback(async () => {
    const supabase = createClient();
    const { data, error: listError } = await supabase.auth.mfa.listFactors();
    if (!listError) setFactors((data?.totp ?? []) as Factor[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFactors();
  }, [loadFactors]);

  const startEnroll = async () => {
    setError("");
    setStarting(true);
    const supabase = createClient();

    // Clear any half-finished (unverified) enrollment so re-trying is clean.
    const { data: existing } = await supabase.auth.mfa.listFactors();
    for (const f of existing?.all ?? []) {
      if (f.status === "unverified") {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator",
    });

    setStarting(false);

    if (enrollError) {
      const msg = enrollError.message?.toLowerCase() ?? "";
      setError(
        msg.includes("not enabled") ||
          msg.includes("disabled") ||
          msg.includes("unsupported")
          ? "TOTP isn't enabled for this project yet. Enable it in Supabase → Authentication → MFA, then try again."
          : enrollError.message
      );
      return;
    }

    setQr(data.totp.qr_code);
    setSecret(data.totp.secret);
    setPendingId(data.id);
    setEnrolling(true);
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingId) return;
    setVerifying(true);
    setError("");
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: pendingId,
      code: code.trim(),
    });

    if (verifyError) {
      setError("Incorrect code. Check your authenticator app and try again.");
      setVerifying(false);
      return;
    }

    resetEnroll();
    await loadFactors();
  };

  const cancelEnroll = async () => {
    if (pendingId) {
      const supabase = createClient();
      await supabase.auth.mfa.unenroll({ factorId: pendingId });
    }
    resetEnroll();
  };

  const resetEnroll = () => {
    setEnrolling(false);
    setVerifying(false);
    setQr("");
    setSecret("");
    setPendingId("");
    setCode("");
    setError("");
  };

  const remove = async (id: string) => {
    if (
      !confirm(
        "Remove this authenticator? You'll no longer be asked for a code when signing in."
      )
    )
      return;
    setRemovingId(id);
    const supabase = createClient();
    await supabase.auth.mfa.unenroll({ factorId: id });
    setRemovingId(null);
    await loadFactors();
  };

  const hasFactor = factors.length > 0;

  return (
    <div className="bg-luxury-800 border border-luxury-700 rounded-2xl p-6 flex flex-col gap-5">
      {/* Status header */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            hasFactor
              ? "bg-green-400/10 border-green-400/25"
              : "bg-amber-500/10 border-amber-500/25"
          }`}
        >
          {hasFactor ? (
            <ShieldCheck className="w-5 h-5 text-green-400" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          )}
        </div>
        <div>
          <p className="text-luxury-50 text-sm font-semibold">
            Two-Factor Authentication
          </p>
          <p
            className={`text-xs mt-0.5 ${
              hasFactor ? "text-green-400" : "text-amber-400"
            }`}
          >
            {loading
              ? "Checking…"
              : hasFactor
                ? "Enabled — a code is required at sign-in."
                : "Not enabled — your account is protected by password only."}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm leading-snug">{error}</p>
        </div>
      )}

      {/* Enrolled factors */}
      {!loading && hasFactor && !enrolling && (
        <div className="flex flex-col divide-y divide-luxury-700/60 border-y border-luxury-700/60">
          {factors.map((f) => (
            <div key={f.id} className="flex items-center gap-3 py-3">
              <Smartphone className="w-4 h-4 text-luxury-400 shrink-0" />
              <span className="text-luxury-200 text-sm flex-1">
                {f.friendly_name || "Authenticator app"}
              </span>
              <button
                onClick={() => remove(f.id)}
                disabled={removingId === f.id}
                className="text-luxury-500 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Remove"
              >
                {removingId === f.id ? (
                  <span className="w-4 h-4 border-2 border-luxury-400/30 border-t-luxury-400 rounded-full animate-spin inline-block" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Enrollment flow */}
      {enrolling ? (
        <form onSubmit={verify} className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="text-luxury-300 text-sm leading-relaxed">
              1. Scan this QR code with an authenticator app (Google
              Authenticator, Authy, 1Password, etc.).
            </p>
            {qr && (
              <div className="self-start bg-white rounded-xl p-3">
                {/* qr_code is a data-URI SVG returned by Supabase */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="2FA QR code" width={160} height={160} />
              </div>
            )}
            {secret && (
              <p className="text-luxury-500 text-xs">
                Can&apos;t scan? Enter this key manually:{" "}
                <span className="text-luxury-200 font-mono break-all">
                  {secret}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-luxury-300 text-xs font-semibold tracking-widest uppercase">
              2. Enter the 6-digit code
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
              autoFocus
              className="bg-luxury-900 border border-luxury-700 focus:border-gold-500 rounded-xl px-4 py-3 text-luxury-50 placeholder-luxury-600 text-center text-lg tracking-[0.4em] font-semibold outline-none transition-colors max-w-48"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={verifying || code.length < 6}
              className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 disabled:cursor-not-allowed text-luxury-900 text-sm font-bold px-5 py-3 rounded-xl tracking-wide transition-colors"
            >
              {verifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-luxury-900/30 border-t-luxury-900 rounded-full animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Enable 2FA
                </>
              )}
            </button>
            <button
              type="button"
              onClick={cancelEnroll}
              className="flex items-center gap-2 text-luxury-400 hover:text-luxury-100 text-sm font-medium px-3 py-3 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        !loading && (
          <button
            onClick={startEnroll}
            disabled={starting}
            className="self-start flex items-center gap-2 bg-luxury-700 hover:bg-luxury-600 disabled:opacity-60 text-luxury-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {starting ? (
              <span className="w-4 h-4 border-2 border-luxury-300/30 border-t-luxury-300 rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {hasFactor ? "Add another authenticator" : "Set up 2FA"}
          </button>
        )
      )}
    </div>
  );
}
