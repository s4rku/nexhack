"use client";

import React from "react";
import { EVENT_EXPERIENCES, EventExperience } from "@/data/nexhackData";
import { SectionHeader } from "../ui/SectionHeader";
import {
  Trophy,
  Laptop,
  GraduationCap,
  Users,
  Flame,
  Building2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface EventsExperiencesSectionProps {
  onJoinClick: () => void;
}

export const EventsExperiencesSection: React.FC<EventsExperiencesSectionProps> = ({
  onJoinClick,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Trophy":
        return <Trophy className="w-5 h-5 text-blue-600" />;
      case "Laptop":
        return <Laptop className="w-5 h-5 text-purple-600" />;
      case "GraduationCap":
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case "Users":
        return <Users className="w-5 h-5 text-cyan-600" />;
      case "Flame":
        return <Flame className="w-5 h-5 text-emerald-600" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-pink-600" />;
      default:
        return <Trophy className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="events" className="py-20 md:py-28 bg-slate-50/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="DYNAMIC ECOSYSTEM"
          badgeVariant="cyan"
          title="SOMETHING IS ALWAYS HAPPENING"
          highlightText="Every Week. Across India."
          highlightGradient="cyan"
          description="From fast midnight sprints and developer mixers to massive convention hall hackathons, our calendar is packed with student-first tech experiences."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {EVENT_EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all">
                    {getIcon(exp.icon)}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                    {exp.statBadge}
                  </span>
                </div>

                <div className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                  {exp.type}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                  {exp.title}
                </h3>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                {exp.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Global Calendar Notice */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 mb-3">
            Want to get notified the second a new hackathon or sprint drops?
          </p>
          <button
            onClick={onJoinClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs shadow-xs transition-all hover:scale-105 cursor-pointer"
          >
            <span>Sync NEXHACK Community Calendar</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
