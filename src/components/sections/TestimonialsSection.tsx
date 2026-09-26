"use client";

import React from "react";
import { COMMUNITY_VALUES } from "@/data/nexhackData";
import { SectionHeader } from "../ui/SectionHeader";
import { Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-50/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="COMMUNITY CHARTER"
          badgeVariant="primary"
          title="WHAT THE COMMUNITY STANDS FOR"
          highlightText="Principles of the NEXHACK Movement"
          highlightGradient="blue"
          description="NEXHACK is built on core values that put students first. Here is what guides our hackathons, workshops, and community spaces."
          align="center"
        />

        {/* Community Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          {COMMUNITY_VALUES.map((val) => (
            <div
              key={val.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
                    {val.badge}
                  </span>
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {val.title}
                </h3>
                <div className="text-xs font-semibold text-slate-500 font-mono mt-1">
                  {val.subtitle}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mt-4">
                  {val.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>NEXHACK Community Principle</span>
                <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform inline-block">
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
