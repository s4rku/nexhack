"use client";

import React from "react";
import { TECH_ECOSYSTEM } from "@/data/nexhackData";
import { Sparkles, Terminal } from "lucide-react";

export const EcosystemPartnersSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wider uppercase mb-3">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            DEVELOPER STACK
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            TECHNOLOGIES & TOOLS WE BUILD WITH
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            NEXHACK hackathons and workshops focus on modern, industry-standard technologies and developer tools.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mt-12">
          {TECH_ECOSYSTEM.map((tech, idx) => (
            <div
              key={idx}
              className="group p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center cursor-default"
            >
              <div className="text-base sm:text-lg font-black tracking-tight text-slate-700 group-hover:text-blue-600 transition-colors">
                {tech.name}
              </div>
              <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-600 transition-colors mt-0.5">
                {tech.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
