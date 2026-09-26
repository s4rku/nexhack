"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResourcePreviewModal } from "@/components/modals/ResourcePreviewModal";
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import { LegalModal } from "@/components/modals/LegalModal";
import { EXTENDED_RESOURCES_DATA, ResourceItem } from "@/data/nexhackData";
import {
  BookOpen,
  Sparkles,
  CheckSquare,
  Terminal,
  Search,
  ArrowRight,
  Clock,
  Tag,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Code2,
  Layers,
  Presentation,
  ShieldCheck,
} from "lucide-react";

export default function ResourcesPage() {
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);

  // Interactive checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    repo: true,
    roles: true,
    scope: false,
    deploy: false,
    backup: false,
    pitch: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);

  const categories = [
    "All",
    "Hackathon Strategy",
    "Frontend & Fullstack",
    "Developer Tooling",
    "Pitch & Presentation",
    "Student Perks",
    "Backend Engineering",
  ];

  const handleRead = (resource: ResourceItem) => {
    setSelectedResource(resource);
  };

  const filteredResources = useMemo(() => {
    return EXTENDED_RESOURCES_DATA.filter((res) => {
      if (selectedCategory !== "All" && res.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesExcerpt = res.excerpt.toLowerCase().includes(q);
        const matchesTags = res.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesExcerpt && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />

      <main className="flex-1 pt-20 sm:pt-24">
        {/* 1. HERO HEADER */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/80 bg-tech-grid overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-blue-600">Developer Playbooks</span>
            </div>

            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 shadow-xs">
                <BookOpen className="w-3.5 h-3.5" />
                <span>KNOWLEDGE BASE & GUIDES</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                The Student Developer <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Playbook</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Practical, fluff-free guides on hackathon execution, modern web frameworks, git branching hygiene, pitch strategy, and verified student perks.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Free & Open-Source
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  Written by Student Builders
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-purple-600" />
                  Code-First Examples
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FILTER & GUIDES DIRECTORY */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Bar */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-xs"
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
                  placeholder="Search articles, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Guides Grid */}
            {filteredResources.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 border border-slate-200">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">No guides match your filter</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or searching other keywords.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      {/* Meta badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {res.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{res.readTime}</span>
                        </div>
                      </div>

                      {/* Title & Excerpt */}
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {res.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {res.excerpt}
                      </p>

                      {/* Content summary preview */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {res.contentSummary.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {res.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleRead(res)}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. INTERACTIVE 24-HOUR HACKATHON READINESS CHECKLIST */}
        <section className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Interactive 24-Hour Hackathon Readiness Checklist
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tick off each essential checkpoint before submitting your project to the judges.
                    </p>
                  </div>
                </div>

                {/* Progress pill */}
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Progress: {checkedCount}/{totalCount} ({progressPercent}%)
                  </span>
                  <div className="w-32 h-2 rounded-full bg-slate-100 mt-1 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3 pt-2">
                {[
                  {
                    key: "repo",
                    title: "GitHub Repository Initialized",
                    desc: "Boilerplate Next.js / Python repo created with .gitignore, LICENSE, and clear README.",
                  },
                  {
                    key: "roles",
                    title: "Roles & Responsibilities Assigned",
                    desc: "Explicit allocation: 1 Frontend Engineer, 1 Backend/Logic Engineer, 1 Presentation & Demo Lead.",
                  },
                  {
                    key: "scope",
                    title: "Single Core User Workflow Scoped",
                    desc: "Focus deeply on solving 1 primary user problem end-to-end rather than 5 half-built mock screens.",
                  },
                  {
                    key: "deploy",
                    title: "Staging Deployment Live on Day 1",
                    desc: "Deployed to Vercel/Fly.io early to avoid network bottlenecks and last-minute build failures.",
                  },
                  {
                    key: "backup",
                    title: "Backup Video Recording Prepared",
                    desc: "1-minute screen recording of working prototype ready in case campus WiFi drops during the live demo.",
                  },
                  {
                    key: "pitch",
                    title: "3-Slide Presentation Deck Ready",
                    desc: "Problem Statement, Solution Architecture, and Future Roadmap kept under 180 seconds.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => toggleCheck(item.key)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      checklist[item.key]
                        ? "bg-emerald-50/60 border-emerald-300"
                        : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={() => {}}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <h4
                        className={`text-sm font-bold ${
                          checklist[item.key] ? "text-emerald-950" : "text-slate-900"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. RECOMMENDED FREE STUDENT TOOLS */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                STUDENT DEVELOPER STACK
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Verified Free Tools & Developer Grants
              </h2>
              <p className="text-sm text-slate-600">
                You don&apos;t need a credit card to build great software. Here are the top verified free tools available for student engineers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-blue-600">GITHUB PACK</span>
                <h3 className="font-bold text-slate-900 text-sm">GitHub Student Developer Pack</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Free access to GitHub Copilot, JetBrains IDEs, domain names from Namecheap, and cloud credits.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-purple-600">EDGE HOSTING</span>
                <h3 className="font-bold text-slate-900 text-sm">Vercel & Next.js Hobby Tier</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deploy unlimited frontends and serverless APIs with automatic SSL, CI/CD previews, and global CDN.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-emerald-600">DATABASE</span>
                <h3 className="font-bold text-slate-900 text-sm">Supabase & Neon Postgres</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generous free relational PostgreSQL databases with built-in instant APIs, branching, and authentication.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-cyan-600">UI / UX</span>
                <h3 className="font-bold text-slate-900 text-sm">Figma for Education</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Free Figma Professional license for students and educators for multi-member design collaboration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CONTRIBUTE A GUIDE BANNER */}
        <section className="py-16 sm:py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              COMMUNITY WRITERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Have You Built Something Awesome? Write a Guide.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              If you solved a tricky engineering bug, built a winning hackathon project, or created an open-source tool, write a playbook for the NEXHACK Developer Hub.
            </p>
            <button
              onClick={() => setIsJoinOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Submit a Developer Playbook
            </button>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={(type) => setLegalModalType(type)} onJoinClick={() => setIsJoinOpen(true)} />

      {/* Modals */}
      <ResourcePreviewModal
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        resource={selectedResource}
      />

      <JoinCommunityModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
      />

      <LegalModal
        isOpen={!!legalModalType}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || "privacy"}
      />
    </div>
  );
}
