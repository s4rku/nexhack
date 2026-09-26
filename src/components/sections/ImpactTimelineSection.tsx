"use client";

import React, { useState } from "react";
import { IMPACT_TIMELINE } from "@/data/nexhackData";
import { SectionHeader } from "../ui/SectionHeader";
import {
  Lightbulb,
  BookOpen,
  Code2,
  Trophy,
  Network,
  Rocket,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const ImpactTimelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Lightbulb":
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case "BookOpen":
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      case "Code2":
        return <Code2 className="w-5 h-5 text-blue-600" />;
      case "Trophy":
        return <Trophy className="w-5 h-5 text-indigo-600" />;
      case "Network":
        return <Network className="w-5 h-5 text-cyan-600" />;
      case "Rocket":
        return <Rocket className="w-5 h-5 text-emerald-600" />;
      default:
        return <Rocket className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="STUDENT BUILDER JOURNEY"
          badgeVariant="primary"
          title="FROM IDEAS TO IMPACT"
          highlightText="The NEXHACK Learning Curve"
          highlightGradient="blue"
          description="How students progress from a blank editor to deploying practical software and building with peers."
          align="center"
        />

        {/* Step indicator bar */}
        <div className="mt-14 hidden md:flex items-center justify-between relative max-w-4xl mx-auto">
          <div className="absolute left-6 right-6 top-6 h-0.5 bg-slate-200 -z-0" />

          {IMPACT_TIMELINE.map((item, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(idx)}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-hidden"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                      : "bg-white border-2 border-slate-200 text-slate-500 hover:border-blue-400 hover:text-slate-800"
                  }`}
                >
                  {item.step}
                </div>
                <span
                  className={`mt-2 text-xs font-bold transition-colors ${
                    isCurrent ? "text-blue-600" : "text-slate-500 group-hover:text-slate-900"
                  }`}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step Detailed View Card */}
        <div className="mt-10 max-w-4xl mx-auto bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                {getIcon(IMPACT_TIMELINE[activeStep].icon)}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                  Step {IMPACT_TIMELINE[activeStep].step}
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {IMPACT_TIMELINE[activeStep].title} — {IMPACT_TIMELINE[activeStep].subtitle}
                </h3>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold shrink-0 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Step {activeStep + 1} of {IMPACT_TIMELINE.length}</span>
            </div>
          </div>

          <div className="py-6">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {IMPACT_TIMELINE[activeStep].description}
            </p>
          </div>

          {/* Stepper navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="text-xs font-bold text-slate-600 disabled:opacity-30 hover:text-slate-900 cursor-pointer"
            >
              ← Previous Step
            </button>

            <span className="text-xs font-mono text-slate-400">
              {IMPACT_TIMELINE[activeStep].title}
            </span>

            <button
              onClick={() =>
                setActiveStep((prev) => (prev + 1) % IMPACT_TIMELINE.length)
              }
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile quick list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 md:hidden">
          {IMPACT_TIMELINE.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                activeStep === idx
                  ? "bg-blue-50 border-blue-300 text-blue-900 font-bold"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              <div className="font-mono text-[10px] text-slate-400">{item.step}</div>
              <div>{item.title}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
