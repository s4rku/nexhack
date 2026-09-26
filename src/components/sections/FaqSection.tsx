"use client";

import React, { useState } from "react";
import { FAQS_DATA } from "@/data/nexhackData";
import { SectionHeader } from "../ui/SectionHeader";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-28 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="GOT QUESTIONS?"
          badgeVariant="primary"
          title="FREQUENTLY ASKED QUESTIONS"
          highlightText="Clear Answers for Builders"
          highlightGradient="blue"
          description="Everything you need to know about joining NEXHACK, competing in our hackathons, and bringing our ecosystem to your campus."
          align="center"
        />

        <div className="mt-12 space-y-3.5">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
