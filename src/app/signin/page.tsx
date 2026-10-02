"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import { LegalModal } from "@/components/modals/LegalModal";
import {
  ShieldCheck,
  Trophy,
  Users,
  Code2,
  Zap,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

/* ── Inline SVG brand icons ─────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

/* ── Provider config ─────────────────────────────────────────────────────── */
const PROVIDERS = [
  {
    id: "google",
    label: "Continue with Google",
    Icon: GoogleIcon,
    className: "bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs hover:shadow-sm",
    iconColor: "",
  },
  {
    id: "discord",
    label: "Continue with Discord",
    Icon: DiscordIcon,
    className: "bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-md shadow-indigo-400/25 hover:shadow-lg border border-[#5865F2]",
    iconColor: "text-white",
  },
  {
    id: "github",
    label: "Continue with GitHub",
    Icon: GitHubIcon,
    className: "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20 hover:shadow-lg border border-slate-900",
    iconColor: "text-white",
  },
] as const;

/* ── Error messages from NextAuth ─────────────────────────────────────────── */
const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Could not start sign-in. Please try again.",
  OAuthCallback: "Something went wrong during sign-in. Please try again.",
  OAuthCreateAccount: "Could not create your account. Please try again.",
  EmailCreateAccount: "Could not create your account. Please try again.",
  Callback: "Sign-in callback failed. Please try again.",
  OAuthAccountNotLinked: "This email is already linked to another provider. Try a different sign-in method.",
  AccessDenied: "Access was denied. Please try again.",
  Default: "An unexpected error occurred. Please try again.",
};

const PERKS = [
  { icon: Trophy, label: "Hackathon Access", desc: "Register for national sprints & win prizes" },
  { icon: Users, label: "2,000+ Community", desc: "Build alongside top student developers" },
  { icon: Code2, label: "Free Resources", desc: "Exclusive learning paths & toolkits" },
];

/* ── Reads ?error= and ?callbackUrl= from the URL (needs Suspense) ─────── */
function SearchParamsReader({
  onError,
  onCallbackUrl,
}: {
  onError: (msg: string | null) => void;
  onCallbackUrl: (url: string) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const err = searchParams.get("error");
    onError(err ? (ERROR_MESSAGES[err] ?? ERROR_MESSAGES.Default) : null);
    const cb = searchParams.get("callbackUrl");
    if (cb) onCallbackUrl(cb);
  }, [searchParams, onError, onCallbackUrl]);
  return null;
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function SignInPage() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState("/");

  const handleSignIn = async (providerId: string) => {
    setErrorMsg(null);
    setLoading(providerId);
    try {
      await signIn(providerId, { callbackUrl });
    } catch {
      setErrorMsg("Could not connect to the sign-in provider. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />

      <main className="flex-1 pt-20 sm:pt-24">
        <section className="relative min-h-[calc(100vh-80px)] flex items-center py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 bg-tech-grid overflow-hidden">
          {/* Ambient orbs */}
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-400/8 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-center">

              {/* ── Left: Brand copy (desktop only) ── */}
              <div className="hidden lg:flex flex-col gap-8">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure Sign In
                  </div>
                  <h1 className="text-[44px] xl:text-5xl font-black tracking-tight text-slate-900 leading-[1.08]">
                    Welcome back to{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                      NEXHACK.
                    </span>
                  </h1>
                  <p className="text-slate-500 text-base leading-relaxed max-w-sm">
                    Pick up where you left off — your hackathons, sessions, and community are waiting.
                  </p>
                </div>

                <div className="space-y-3">
                  {PERKS.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-200 hover:shadow-sm transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Code accent */}
                <div className="code-window rounded-2xl p-5 text-xs font-mono leading-relaxed">
                  <div className="flex gap-1.5 mb-3.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="space-y-0.5">
                    <div><span className="text-slate-500">// one click to continue</span></div>
                    <div><span className="text-cyan-400">await </span><span className="text-violet-400">nexhack</span><span className="text-slate-400">.</span><span className="text-yellow-300">signIn</span><span className="text-slate-400">(</span><span className="text-emerald-400">&quot;google&quot;</span><span className="text-slate-400">);</span></div>
                    <div><span className="text-cyan-400">await </span><span className="text-violet-400">nexhack</span><span className="text-slate-400">.</span><span className="text-yellow-300">signIn</span><span className="text-slate-400">(</span><span className="text-indigo-400">&quot;discord&quot;</span><span className="text-slate-400">);</span></div>
                    <div><span className="text-cyan-400">await </span><span className="text-violet-400">nexhack</span><span className="text-slate-400">.</span><span className="text-yellow-300">signIn</span><span className="text-slate-400">(</span><span className="text-slate-300">&quot;github&quot;</span><span className="text-slate-400">);</span></div>
                    <div className="pt-1"><span className="text-slate-500">// no passwords. ever.</span></div>
                  </div>
                </div>
              </div>

              {/* ── Right: Auth card ── */}
              <div className="w-full">
                <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl shadow-blue-900/5">

                  {/* Logo */}
                  <div className="flex justify-center mb-7">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center p-2.5 shadow-lg border border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo-icon.png" alt="NEXHACK" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Heading */}
                  <div className="text-center mb-8 space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" />
                      Sign In
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mt-2">Welcome back</h2>
                    <p className="text-sm text-slate-500">Choose how you want to sign in.</p>
                  </div>

                  {/* Reads ?error= and ?callbackUrl= — Suspense required */}
                  <Suspense fallback={null}>
                    <SearchParamsReader
                      onError={setErrorMsg}
                      onCallbackUrl={setCallbackUrl}
                    />
                  </Suspense>

                  {/* Error banner */}
                  {errorMsg && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Provider buttons */}
                  <div className="space-y-3">
                    {PROVIDERS.map(({ id, label, Icon, className, iconColor }) => (
                      <button
                        key={id}
                        type="button"
                        disabled={loading !== null}
                        onClick={() => handleSignIn(id)}
                        className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.015] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer ${className}`}
                        aria-label={label}
                      >
                        <span className={`shrink-0 ${iconColor}`}>
                          {loading === id ? (
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                          ) : (
                            <Icon />
                          )}
                        </span>
                        <span className="flex-1 text-left">{label}</span>
                        {loading !== id && <ArrowRight className="w-4 h-4 opacity-40 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-7">
                    <span className="flex-1 h-px bg-slate-100" />
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                      <Zap className="w-3 h-3" />
                      No password needed
                    </span>
                    <span className="flex-1 h-px bg-slate-100" />
                  </div>

                  <p className="text-center text-xs text-slate-500">
                    No account yet?{" "}
                    <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                      Create one free
                    </Link>
                  </p>

                  <p className="mt-5 text-center text-[10px] text-slate-400 leading-relaxed">
                    By continuing you agree to our{" "}
                    <button onClick={() => setLegalModalType("terms")} className="underline hover:text-slate-600 transition-colors cursor-pointer">Terms</button>
                    {" & "}
                    <button onClick={() => setLegalModalType("privacy")} className="underline hover:text-slate-600 transition-colors cursor-pointer">Privacy Policy</button>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={(type) => setLegalModalType(type)} onJoinClick={() => setIsJoinOpen(true)} />
      <JoinCommunityModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <LegalModal isOpen={!!legalModalType} onClose={() => setLegalModalType(null)} type={legalModalType || "privacy"} />
    </div>
  );
}
