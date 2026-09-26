"use client";

import React, { useState } from "react";
import { RESOURCES_DATA, ResourceItem } from "@/data/nexhackData";
import { SectionHeader } from "../ui/SectionHeader";
import { Clock, Calendar, ArrowRight, BookOpen, Sparkles } from "lucide-react";

interface ResourcesSectionProps {
  onReadResource: (resource: ResourceItem) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ onReadResource }) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const tags = ["All", "Hackathons", "Generative AI", "Startup", "Git"];

  const filteredResources = RESOURCES_DATA.filter((r) => {
    if (selectedTag === "All") return true;
    return r.tags.includes(selectedTag);
  });

  return (
    <section id="resources" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="CURATED KNOWLEDGE BASE"
          badgeVariant="primary"
          title="THE NEXHACK HUB"
          highlightText="Engineering Guides & Playbooks"
          highlightGradient="blue"
          description="High-signal technical guides, pitch blueprints, and hackathon strategies written by veterans to help you build and ship faster."
          align="center"
        />

        {/* Filter Tags */}
        <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-mono text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {resource.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {resource.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                  {resource.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {resource.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{resource.date}</span>
                <button
                  onClick={() => onReadResource(resource)}
                  className="font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
