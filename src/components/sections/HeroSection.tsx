"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Trophy,
  Users,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface HeroSectionProps {
  onJoinClick: () => void;
  onExploreHackathons: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onJoinClick,
  onExploreHackathons,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<"hackathon" | "community">("hackathon");

  return (
    <section
      id="home"
      className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28 overflow-hidden bg-tech-grid"
    >
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[500px] bg-gradient-to-tr from-blue-400/15 via-indigo-300/10 to-cyan-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 text-left space-y-5 sm:space-y-6">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 pr-3 sm:pr-4 rounded-full bg-blue-50/90 border border-blue-200/90 shadow-2xs max-w-full">
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase shrink-0">
                COMMUNITY
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-800 flex items-center gap-1 truncate">
                <span className="truncate">THE NEXT GENERATION OF TECH COMMUNITY</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 hidden sm:inline" />
              </span>
            </div>

            {/* Main Punchy Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[66px] font-black tracking-tight text-slate-900 leading-[1.12] sm:leading-[1.08] break-words">
              BUILD THE FUTURE. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                HACK WHAT&apos;S NEXT.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              NEXHACK brings students, developers, creators and innovators together through
              hackathons, knowledge sessions, workshops and experiences that turn ideas into reality.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={onExploreHackathons}
                className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-cyan-200" />
                <span>Explore Hackathons</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onJoinClick}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm border border-slate-300 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Join NEXHACK</span>
              </button>
            </div>

            {/* Secondary Subtext */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-3 text-[11px] sm:text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Hackathons
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                Workshops
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                Knowledge Sessions
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Community
              </span>
            </div>

            {/* Note */}
            <div className="pt-1 flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-black text-blue-400 p-1 border border-blue-500/40 shadow-xs shadow-blue-500/20 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-icon.png" alt="NEXHACK" className="w-full h-full object-contain" />
              </div>
              <div className="text-xs text-slate-600 font-medium">
                A student-driven technology community across schools &amp; colleges.
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Stack */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Event Card */}
              <div className="glass-card p-4 sm:p-5 rounded-2xl relative z-20 border border-slate-200/90 shadow-xl mb-3 sm:mb-4 bg-white/95">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      STUDENT HACKATHON
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Upcoming Sprint</span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center p-1.5 shadow-md shadow-blue-500/20 border border-blue-500/40 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo-icon.png" alt="NEXHACK" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">NEXHACK 3.0</h3>
                      <p className="text-[11px] sm:text-xs text-slate-500">Build What&apos;s Next • Hybrid Edition</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] sm:text-xs font-bold text-blue-600">Open to All</span>
                    <span className="block text-[9px] sm:text-[10px] text-slate-400">Schools &amp; Colleges</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="truncate pr-2">Tracks: AI, Web, Open Innovation</span>
                  <span className="font-bold text-blue-600 shrink-0">Free Registration</span>
                </div>
              </div>

              {/* Code Snippet Card */}
              <div className="code-window p-3.5 sm:p-4 rounded-2xl relative z-10 shadow-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="font-mono text-slate-400 ml-1.5 text-[10px] sm:text-[11px] truncate">
                      nexhack.config.ts
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveCodeTab("hackathon")}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        activeCodeTab === "hackathon"
                          ? "bg-blue-500/20 text-blue-400 font-bold"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Config
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("community")}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        activeCodeTab === "community"
                          ? "bg-purple-500/20 text-purple-400 font-bold"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Pillars
                    </button>
                  </div>
                </div>

                <div className="pt-2.5 sm:pt-3 font-mono text-[10px] sm:text-[11px] leading-relaxed text-slate-300 overflow-x-auto no-scrollbar">
                  {activeCodeTab === "hackathon" ? (
                    <>
                      <p className="text-slate-500">// NEXHACK Community Manifest</p>
                      <p>
                        <span className="text-purple-400">export const</span>{" "}
                        <span className="text-yellow-300">nexhackCommunity</span> = &#123;
                      </p>
                      <p className="pl-3 sm:pl-4">
                        name: <span className="text-emerald-300">&quot;NEXHACK&quot;</span>,
                      </p>
                      <p className="pl-3 sm:pl-4">
                        tagline:{" "}
                        <span className="text-emerald-300">
                          &quot;Build. Hack. Learn. Connect.&quot;
                        </span>
                        ,
                      </p>
                      <p className="pl-3 sm:pl-4">
                        target:{" "}
                        <span className="text-cyan-300">
                          [&quot;Schools&quot;, &quot;Colleges&quot;]
                        </span>
                        ,
                      </p>
                      <p className="pl-3 sm:pl-4">
                        cost: <span className="text-emerald-400">&quot;100% Free for Students&quot;</span>,
                      </p>
                      <p>&#125;;</p>
                      <p className="text-emerald-400 font-bold flex items-center gap-1.5 mt-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Ready to build, learn and compete.</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-500">// Core Pillars</p>
                      <p>
                        <span className="text-purple-400">const</span> pillars = [
                      </p>
                      <p className="pl-3 sm:pl-4">
                        <span className="text-emerald-300">&quot;BUILD: Turn ideas into real projects&quot;</span>,
                      </p>
                      <p className="pl-3 sm:pl-4">
                        <span className="text-emerald-300">&quot;LEARN: Learn from experienced builders&quot;</span>,
                      </p>
                      <p className="pl-3 sm:pl-4">
                        <span className="text-emerald-300">&quot;COMPETE: Participate in hackathons&quot;</span>,
                      </p>
                      <p className="pl-3 sm:pl-4">
                        <span className="text-emerald-300">&quot;CONNECT: Meet fellow students & mentors&quot;</span>,
                      </p>
                      <p>];</p>
                    </>
                  )}
                </div>
              </div>

              {/* Floating badge pill - safe positioning */}
              <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-4 sm:-left-3 z-20 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 max-w-xs">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-800">
                  Build • Hack • Learn • Connect
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
