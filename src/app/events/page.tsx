"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SessionRsvpModal } from "@/components/modals/SessionRsvpModal";
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import { LegalModal } from "@/components/modals/LegalModal";
import { SpeakerSession } from "@/data/nexhackData";
import {
  Calendar,
  Laptop,
  Video,
  Users,
  ArrowRight,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Terminal,
  ShieldCheck,
  GraduationCap,
  ChevronDown,
} from "lucide-react";

export default function EventsPage() {
  const [eventsList, setEventsList] = useState<SpeakerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<SpeakerSession | null>(null);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);

  const categories = ["All", "AI & Machine Learning", "Web Development", "Cloud & DevOps", "Startups & Career"];

  // Fetch real events directly from MongoDB API
  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success && Array.isArray(data.events)) {
          setEventsList(data.events);
        }
      } catch (err) {
        console.error("Failed to fetch events from MongoDB:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  const handleRsvp = (session: SpeakerSession) => {
    setSelectedSession(session);
  };

  const filteredSessions = useMemo(() => {
    return eventsList.filter((session) => {
      // Category filter
      if (selectedCategory !== "All" && session.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = session.title?.toLowerCase().includes(q);
        const matchesSpeaker = session.speaker?.name?.toLowerCase().includes(q);
        const matchesHighlights = session.highlights?.some((h) => h.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSpeaker && !matchesHighlights) {
          return false;
        }
      }
      return true;
    });
  }, [eventsList, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />

      <main className="flex-1 pt-20 sm:pt-24">
        {/* 1. HERO HEADER */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/80 bg-tech-grid overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-blue-600">Events & Workshops</span>
            </div>

            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-200 shadow-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>INTERACTIVE SESSIONS & LABS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Masterclasses, Code-Alongs & <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Tech Workshops</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Practical, code-first sessions designed to take you from foundational understanding to shipping real software, taught by experienced mentors and practitioners.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  Hands-On Code Labs
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                  <Video className="w-4 h-4 text-purple-600" />
                  Live Virtual Stream
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Zero Cost (100% Free)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FILTER & DIRECTORY */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Bar */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search workshop topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>
            </div>

            {/* Sessions Grid */}
            {filteredSessions.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 border border-slate-200">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">No sessions match your filter</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or search keywords.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      {/* Top Category & Level */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          {session.category}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {session.level}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                        {session.title}
                      </h3>

                      {/* Speaker Badge */}
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <img
                          src={session.speaker.avatar}
                          alt={session.speaker.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs truncate">
                            {session.speaker.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {session.speaker.role} • {session.speaker.company}
                          </p>
                        </div>
                      </div>

                      {/* Time & Seats */}
                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>{session.date} • {session.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{session.duration} ({session.mode})</span>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1.5 pt-1">
                        {session.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-4 border-t border-slate-100">
                      {session.isCallForSpeakers ? (
                        <button
                          onClick={() => setIsJoinOpen(true)}
                          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Apply as Speaker / Mentor</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRsvp(session)}
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>RSVP Free Seat ({session.seatsLeft} left)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. THE 4 LEARNING OUTCOMES */}
        <section className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-wider">
                HOW WE TEACH
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                What Makes NEXHACK Workshops Different
              </h2>
              <p className="text-sm text-slate-600">
                We reject passive lecture slideshows. Our sessions are built around write-along code, real deployments, and transparent debugging.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 w-fit">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Real Code-Alongs</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instructors build live in VS Code. You see syntax errors, terminal debugging, and genuine deployment workflows.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 w-fit">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Starter Repositories</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every attendee receives a clean GitHub boilerplate repository with pre-configured dependencies to keep building.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 w-fit">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">100% Free Access</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No paid paywalls, no upsells. Knowledge sessions are open to every high school and university student across India.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 w-fit">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Direct Mentor Q&A</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated 20-minute open microphone sessions to discuss your hackathon ideas, project architecture, and career paths.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CALL FOR SPEAKERS BANNER */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="space-y-3 text-center lg:text-left max-w-2xl">
                <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                  COMMUNITY INSTRUCTOR CALL
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Share Your Engineering Craft with 10,000+ Students
                </h3>
                <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                  Are you a working software engineer, founder, or senior student with deep expertise in AI, Web, DevOps, or Systems? Lead a weekend workshop and inspire India&apos;s next generation of builders.
                </p>
              </div>

              <button
                onClick={() => setIsJoinOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-2"
              >
                <span>Apply as Speaker / Mentor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={(type) => setLegalModalType(type)} onJoinClick={() => setIsJoinOpen(true)} />

      {/* Modals */}
      <SessionRsvpModal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        session={selectedSession}
      />

      <JoinCommunityModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        defaultRole="Mentor / Speaker"
      />

      <LegalModal
        isOpen={!!legalModalType}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || "privacy"}
      />
    </div>
  );
}
