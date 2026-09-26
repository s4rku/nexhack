"use client";

import React from "react";
import { NEXHACK_PILLARS, PillarItem } from "@/data/nexhackData";
import { SectionHeader } from "../ui/SectionHeader";
import { Code2, BookOpen, Flame, Sparkles, Check, ArrowUpRight } from "lucide-react";

interface WhatIsNexhackProps {
  onJoinClick: () => void;
}

export const WhatIsNexhack: React.FC<WhatIsNexhackProps> = ({ onJoinClick }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="w-6 h-6 text-blue-600" />;
      case "BookOpen":
        return <BookOpen className="w-6 h-6 text-purple-600" />;
      case "Flame":
        return <Flame className="w-6 h-6 text-indigo-600" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-cyan-600" />;
      default:
        return <Code2 className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="about" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="THE NEXHACK PHILOSOPHY"
          badgeVariant="primary"
          title="More Than Hackathons."
          highlightText="A Community of Builders."
          highlightGradient="blue"
          description="NEXHACK is a student-driven technology community designed to create opportunities for students to learn, build, compete, collaborate, and connect. From your first coding competition to building a venture-backed startup, we provide the launchpad."
          align="center"
        />

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {NEXHACK_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              {/* Top Accent Gradient Bar */}
              <div
                className={`absolute top-0 left-6 right-6 h-1 rounded-b-md bg-gradient-to-r ${pillar.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
              />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50/80 transition-all">
                    {getIcon(pillar.iconName)}
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-1 font-mono">
                  {pillar.tagline}
                </p>

                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Bullet points */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                {pillar.bulletPoints.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Invitation */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-slate-900">
              Want to experience the builder journey first-hand?
            </h4>
            <p className="text-sm text-slate-600">
              Join free, pick a track, and get invited to our next private Discord sprint.
            </p>
          </div>
          <button
            onClick={onJoinClick}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all hover:gap-3 cursor-pointer shrink-0"
          >
            <span>Claim Your Free Student ID</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
