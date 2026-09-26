"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface NewsletterCtaSectionProps {
  onJoinClick: () => void;
  onExploreEvents: () => void;
}

export const NewsletterCtaSection: React.FC<NewsletterCtaSectionProps> = ({
  onJoinClick,
  onExploreEvents,
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "Footer CTA" }),
      });
      setSubscribed(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Safe fallback
      }
    } catch (err) {
      console.error("Newsletter error:", err);
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-6 sm:p-12 lg:p-16 shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>THE CALL TO CODE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.12]">
              DON&apos;T JUST WATCH THE FUTURE. <br />
              <span className="text-cyan-200">BUILD IT.</span>
            </h2>

            <p className="text-xs sm:text-base text-white/90 leading-relaxed max-w-2xl mx-auto font-normal">
              Join NEXHACK and be part of a community where ideas turn into projects, projects turn
              into opportunities, and students become builders.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
              <button
                onClick={onJoinClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm shadow-xl hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Join NEXHACK Free</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>

              <button
                onClick={onExploreEvents}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-black/25 hover:bg-black/35 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span>Explore Events</span>
              </button>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="pt-6 sm:pt-8 max-w-md mx-auto border-t border-white/20">
              {subscribed ? (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-200 bg-white/10 py-3 px-4 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>You&apos;re subscribed to event updates!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter student email..."
                      className="w-full px-3.5 py-2.5 sm:py-3 text-xs rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/70 focus:outline-hidden focus:bg-white/25 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl bg-white text-blue-600 font-bold text-xs hover:bg-slate-100 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "..." : "Subscribe"}
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-white/75">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Free student newsletter • No spam</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
