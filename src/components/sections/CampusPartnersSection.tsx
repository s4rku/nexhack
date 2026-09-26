"use client";

import React, { useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { CAMPUS_PARTNERS_DATA } from "@/data/nexhackData";
import {
  Award,
  CheckCircle2,
  Send,
  Download,
  ShieldCheck,
} from "lucide-react";

export const CampusPartnersSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    orgType: "College / University",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="campus" className="py-16 sm:py-20 md:py-28 bg-slate-50/70 relative">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="INSTITUTIONAL PARTNERSHIPS"
          badgeVariant="primary"
          title="BRING NEXHACK TO YOUR CAMPUS"
          highlightText="Organize Events on Your Campus"
          highlightGradient="blue"
          description={CAMPUS_PARTNERS_DATA.subheadline}
          align="center"
        />

        {/* 4 Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12">
          {CAMPUS_PARTNERS_DATA.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs"
            >
              <div className="text-2xl sm:text-3xl font-black text-blue-600">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-600 mt-0.5 sm:mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mt-8 sm:mt-12">
          {/* Left: Benefits */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4 sm:space-y-5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Why Partner With NEXHACK?
              </h3>

              <div className="space-y-3.5 sm:space-y-4">
                {CAMPUS_PARTNERS_DATA.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{benefit.title}</div>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Open for:
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-700">
                  {[
                    "Schools (Grades 8-12)",
                    "Colleges & Universities",
                    "Student Tech Clubs",
                    "Incubators & E-Cells",
                  ].map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px] sm:text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-lg relative">
              {submitted ? (
                <div className="text-center py-6 sm:py-8 space-y-3 sm:space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900">Partnership Request Received</h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our
                    community partnerships team will reach out to{" "}
                    <strong className="text-slate-900">{formData.email}</strong> shortly.
                  </p>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        organization: "",
                        email: "",
                        phone: "",
                        orgType: "College / University",
                        message: "",
                      });
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline pt-2 block mx-auto"
                  >
                    Submit another campus request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Partner With Us</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Submit this form to discuss organizing a hackathon or workshop on your campus.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Prof. / Student Lead Name"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        College / School Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({ ...formData, organization: e.target.value })
                        }
                        placeholder="e.g. Institute of Technology"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@college.edu or gmail"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Organization Type *
                    </label>
                    <select
                      value={formData.orgType}
                      onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                    >
                      <option value="College / University">College / University</option>
                      <option value="School (K-12)">School (Grades 8-12)</option>
                      <option value="Student Tech Society / Club">Student Tech Club / Society</option>
                      <option value="Incubator / E-Cell">Startup Incubator / E-Cell</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Message / Proposed Event
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about expected students or preferred dates..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin mr-2">⟳</span>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit Campus Inquiry"}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Free collaboration for student communities</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
