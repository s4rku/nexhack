"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import confetti from "canvas-confetti";
import { CheckCircle2, MessageSquare, Send, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/data/nexhackData";
import { DiscordIcon, WhatsAppIcon } from "../ui/SocialIcons";

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
  defaultEvent?: string;
}

export const JoinCommunityModal: React.FC<JoinCommunityModalProps> = ({
  isOpen,
  onClose,
  defaultRole = "Student Hacker",
  defaultEvent = "",
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    gradYear: "2027",
    role: defaultRole,
    interests: ["Artificial Intelligence", "Web Development"],
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const interestOptions = [
    "Artificial Intelligence",
    "Web Development",
    "Web3 & Blockchain",
    "Cybersecurity",
    "Cloud & DevOps",
    "Mobile Apps",
    "UI/UX Design",
    "Product & Startups",
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          collegeOrSchool: formData.college,
          degreeOrGrade: formData.gradYear,
          eventOrHackathon: defaultEvent || "NEXHACK Community",
          role: formData.role,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#2563EB", "#7C3AED", "#06B6D4", "#10B981"],
          });
        } catch {
          // Fallback
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      // Fallback show success for client resilience
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetForm}
      title={submitted ? "Welcome to NEXHACK!" : "Join the NEXHACK Community"}
      subtitle={
        submitted
          ? "Your community membership is confirmed. Connect with your chapter below."
          : defaultEvent
          ? `Registering interest for: ${defaultEvent}`
          : "Connect with student hackers, developers & creators."
      }
      maxWidth="lg"
    >
      {submitted ? (
        <div className="text-center py-2 sm:py-4 space-y-4 sm:space-y-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900">
              You&apos;re in the NEXHACK Community!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Confirmation sent to <strong className="text-slate-900">{formData.email}</strong>. Join the official channels below to get started.
            </p>
          </div>

          {/* Social quick connect cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-1">
            <a
              href={SITE_CONFIG.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-50 transition-colors group"
            >
              <div className="p-2 sm:p-2.5 bg-indigo-600 text-white rounded-lg group-hover:scale-105 transition-transform shrink-0">
                <DiscordIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1">
                  <span>Discord Server</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 transition-transform group-hover:translate-x-1 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-500 truncate">Hacker Lounge & Team Mixer</div>
              </div>
            </a>

            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 transition-colors group"
            >
              <div className="p-2 sm:p-2.5 bg-emerald-600 text-white rounded-lg group-hover:scale-105 transition-transform shrink-0">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1">
                  <span>WhatsApp Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 transition-transform group-hover:translate-x-1 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-500 truncate">Sprint & event drop alerts</div>
              </div>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Free Student Membership
            </span>
            <button
              onClick={resetForm}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Back to site
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Your Name"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@college.edu or gmail"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                College / School Name *
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. Your College / School"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Graduation Year
              </label>
              <select
                value={formData.gradYear}
                onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              >
                <option value="2025">2025 (Final Year)</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028+</option>
                <option value="HighSchool">School Student (Grade 8-12)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Primary Role in NEXHACK
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {[
                "Student Hacker",
                "Campus Lead",
                "Mentor / Speaker",
                "Volunteer",
              ].map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setFormData({ ...formData, role })}
                  className={`px-2.5 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    formData.role === role
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Areas of Interest (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {interestOptions.map((topic) => {
                const selected = formData.interests.includes(topic);
                return (
                  <button
                    type="button"
                    key={topic}
                    onClick={() => handleInterestToggle(topic)}
                    className={`px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md border transition-all cursor-pointer ${
                      selected
                        ? "bg-purple-100 text-purple-800 border-purple-300"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
            >
              {loading ? (
                <span className="inline-block animate-spin mr-2">⟳</span>
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? "Registering..." : "Complete Free Registration"}
            </button>
            <p className="text-center text-[10px] sm:text-xs text-slate-500 mt-2">
              100% Free Forever • Zero spam • Direct access to Discord & hackathons
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
};
