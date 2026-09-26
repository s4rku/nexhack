"use client";

import React, { useState, useEffect } from "react";
import { SpeakerSession } from "@/data/nexhackData";
import { SectionHeader } from "../ui/SectionHeader";
import {
  Calendar,
  Clock,
  Video,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Mic,
} from "lucide-react";

interface KnowledgeSessionsSectionProps {
  onRsvpClick: (session: SpeakerSession) => void;
}

export const KnowledgeSessionsSection: React.FC<KnowledgeSessionsSectionProps> = ({
  onRsvpClick,
}) => {
  const [sessionsList, setSessionsList] = useState<SpeakerSession[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success && Array.isArray(data.events)) {
          setSessionsList(data.events);
        }
      } catch (err) {
        console.error("KnowledgeSessionsSection fetch error:", err);
      }
    }
    load();
  }, []);

  const categories = [
    "All",
    "AI & Machine Learning",
    "Web Development",
    "Web3",
    "Cybersecurity",
    "Cloud & DevOps",
    "Startups & Career",
  ];

  const filteredSessions = sessionsList.filter((session) => {
    return activeCategory === "All" || session.category === activeCategory;
  });

  return (
    <section id="sessions" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="TECHNICAL WORKSHOPS"
          badgeVariant="purple"
          title="LEARN FROM PEOPLE WHO BUILD"
          highlightText="Hands-On Knowledge Sessions"
          highlightGradient="purple"
          description="Interactive technical sessions covering AI, full-stack web development, open-source tooling, and software engineering foundations."
          align="center"
        />

        {/* Categories Bar */}
        <div className="mt-12 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-3xl bg-white border border-slate-200 mt-10">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-sm">New sessions &amp; workshops announcing soon</h3>
            <p className="text-xs text-slate-500 mt-1">Our technical leads and mentors are scheduling the next sprints.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                    {session.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {session.isCallForSpeakers ? "Call Open" : `${session.seatsLeft} spots open`}
                  </span>
                </div>

                {/* Session Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                  {session.title}
                </h3>

                {/* Highlights List */}
                <div className="mt-3.5 space-y-1.5">
                  {session.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-purple-600 font-bold shrink-0">›</span>
                      <span className="leading-snug">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                {/* Speaker Info */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm border-2 border-purple-200 shrink-0">
                    {session.isCallForSpeakers ? <Mic className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      {session.speaker.name}
                      {session.speaker.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      {session.speaker.role} • {session.speaker.company}
                    </div>
                  </div>
                </div>

                {/* Time & Action Button */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100/80 text-xs">
                  <div className="text-slate-500">
                    <div className="font-semibold text-slate-800">{session.date}</div>
                    <div className="text-[10px]">{session.time}</div>
                  </div>

                  <button
                    onClick={() => onRsvpClick(session)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer hover:gap-2"
                  >
                    <span>{session.isCallForSpeakers ? "Apply to Speak" : "RSVP Free"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};
