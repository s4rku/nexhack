"use client";

import React, { useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { SITE_CONFIG } from "@/data/nexhackData";
import {
  ArrowRight,
  Radio,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon,
  XTwitterIcon,
} from "@/components/ui/SocialIcons";

interface CommunityNetworkSectionProps {
  onJoinClick: () => void;
}

export const CommunityNetworkSection: React.FC<CommunityNetworkSectionProps> = ({
  onJoinClick,
}) => {
  const [activeNode, setActiveNode] = useState<string>("Bengaluru");

  const campusNodes = [
    { id: "Delhi", name: "Delhi NCR Hub", x: "32%", y: "25%", region: "North India" },
    { id: "Bengaluru", name: "Bengaluru Hub", x: "40%", y: "75%", region: "South India" },
    { id: "Mumbai", name: "Mumbai Chapter", x: "24%", y: "55%", region: "West India" },
    { id: "Pune", name: "Pune Chapter", x: "28%", y: "62%", region: "West India" },
    { id: "Hyderabad", name: "Hyderabad Chapter", x: "45%", y: "60%", region: "South India" },
    { id: "Kolkata", name: "Kolkata Chapter", x: "72%", y: "42%", region: "East India" },
    { id: "Chennai", name: "Chennai Chapter", x: "48%", y: "82%", region: "South India" },
  ];

  const socialChannels = [
    {
      name: "WhatsApp Community",
      desc: "Instant sprint announcements, exclusive RSVP drops, priority passes",
      members: "Direct Alerts",
      href: SITE_CONFIG.whatsappUrl,
      icon: WhatsAppIcon,
      color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      name: "LinkedIn Network",
      desc: "Student project spotlights, sponsor job boards, career opportunities",
      members: "Professional Network",
      href: SITE_CONFIG.linkedinUrl,
      icon: LinkedInIcon,
      color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Instagram",
      desc: "Behind-the-scenes hackathon recaps, photo galleries, student stories",
      members: "Event Photos",
      href: SITE_CONFIG.instagramUrl,
      icon: InstagramIcon,
      color: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
    },
    {
      name: "X (Twitter)",
      desc: "Live hackathon updates, open-source threads, builder discourse",
      members: "Developer Updates",
      href: SITE_CONFIG.xUrl,
      icon: XTwitterIcon,
      color: "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200",
      buttonColor: "bg-slate-900 hover:bg-slate-800",
    },
  ];

  const currentNode = campusNodes.find((n) => n.id === activeNode) || campusNodes[0];

  return (
    <section id="community" className="py-16 sm:py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="STUDENT NETWORK"
          badgeVariant="primary"
          title="FIND YOUR PEOPLE."
          highlightText="BUILD SOMETHING BIG."
          highlightGradient="blue"
          description="NEXHACK connects ambitious students across schools, colleges, and cities. Find teammates, join cross-campus hackathon squads, and build together."
          align="center"
        />

        {/* Campus Network Node Map */}
        <div className="mt-10 sm:mt-14 p-4 sm:p-8 lg:p-10 rounded-3xl bg-slate-900 text-white relative shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-mono text-cyan-300">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                <span>PAN-INDIA CAMPUS NETWORK</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black">
                Connected Campuses. Collaborative Sprints.
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect with student chapters, technical clubs, and peer squads in your city and across India.
              </p>

              {/* Active Hub Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    {currentNode.name}
                  </span>
                  <span className="text-[10px] font-mono bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full">
                    {currentNode.region}
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Student developers collaborating on hackathons and technical bootcamps.
                </div>
              </div>

              {/* Mobile Hub Selector Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {campusNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeNode === node.id
                        ? "bg-cyan-500 text-slate-900 font-bold"
                        : "bg-white/10 text-slate-300 hover:bg-white/20"
                    }`}
                  >
                    {node.id}
                  </button>
                ))}
              </div>

              <button
                onClick={onJoinClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Join the Community →</span>
              </button>
            </div>

            {/* Right: Node Visual */}
            <div className="lg:col-span-7 relative h-60 sm:h-80 md:h-96 rounded-2xl bg-slate-950/80 border border-slate-800 p-3 sm:p-4 flex items-center justify-center overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="32%" y1="25%" x2="24%" y2="55%" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                <line x1="32%" y1="25%" x2="72%" y2="42%" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                <line x1="24%" y1="55%" x2="28%" y2="62%" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                <line x1="28%" y1="62%" x2="40%" y2="75%" stroke="#3b82f6" strokeWidth="2" opacity="0.8" />
                <line x1="40%" y1="75%" x2="45%" y2="60%" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.6" />
                <line x1="40%" y1="75%" x2="48%" y2="82%" stroke="#06b6d4" strokeWidth="2" opacity="0.7" />
                <line x1="45%" y1="60%" x2="72%" y2="42%" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              </svg>

              {campusNodes.map((node) => {
                const isSelected = activeNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    style={{ left: node.x, top: node.y }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden transition-transform cursor-pointer ${
                      isSelected ? "scale-110 sm:scale-125 z-20" : "scale-100 z-10"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      {isSelected && (
                        <span className="absolute w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-cyan-400/40 animate-ping" />
                      )}
                      <div
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-colors ${
                          isSelected
                            ? "bg-cyan-400 border-white shadow-lg"
                            : "bg-blue-600 border-slate-900 group-hover:bg-cyan-300"
                        }`}
                      />
                      <span className="absolute top-4 sm:top-5 whitespace-nowrap text-[9px] sm:text-[10px] font-mono font-bold bg-slate-900/90 text-slate-200 px-1.5 sm:px-2 py-0.5 rounded-md border border-slate-700 pointer-events-none">
                        {node.id}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Social / Community Links Grid */}
        <div className="mt-10 sm:mt-14">
          <div className="text-center mb-6 sm:mb-8">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Connect with fellow students & organizers
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Select your preferred platform to stay updated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {socialChannels.map((channel) => {
              const IconComp = channel.icon;
              return (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${channel.color}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-white shadow-2xs">
                        <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80">
                        {channel.members}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-900 text-sm">{channel.name}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{channel.desc}</p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    <span>Connect Now</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
