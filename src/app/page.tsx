"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { WhatIsNexhack } from "@/components/sections/WhatIsNexhack";
import { HackathonsSection } from "@/components/sections/HackathonsSection";
import { KnowledgeSessionsSection } from "@/components/sections/KnowledgeSessionsSection";
import { EventsExperiencesSection } from "@/components/sections/EventsExperiencesSection";
import { CommunityNetworkSection } from "@/components/sections/CommunityNetworkSection";
import { CampusPartnersSection } from "@/components/sections/CampusPartnersSection";
import { EcosystemPartnersSection } from "@/components/sections/EcosystemPartnersSection";
import { ImpactTimelineSection } from "@/components/sections/ImpactTimelineSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ResourcesSection } from "@/components/sections/ResourcesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { NewsletterCtaSection } from "@/components/sections/NewsletterCtaSection";

// Modals
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import { HackathonDetailModal } from "@/components/modals/HackathonDetailModal";
import { SessionRsvpModal } from "@/components/modals/SessionRsvpModal";
import { ResourcePreviewModal } from "@/components/modals/ResourcePreviewModal";
import { LegalModal } from "@/components/modals/LegalModal";

// Data types
import { HackathonItem, SpeakerSession, ResourceItem } from "@/data/nexhackData";

export default function HomePage() {
  // Modal states
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedHackathonEvent, setSelectedHackathonEvent] = useState("");
  const [selectedHackathonDetail, setSelectedHackathonDetail] = useState<HackathonItem | null>(null);
  const [selectedSessionRsvp, setSelectedSessionRsvp] = useState<SpeakerSession | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);

  // Handlers
  const handleOpenJoin = (eventTitle?: string) => {
    setSelectedHackathonEvent(eventTitle || "");
    setIsJoinModalOpen(true);
  };

  const handleScrollToHackathons = () => {
    const el = document.getElementById("hackathons");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewHackathon = (hackathon: HackathonItem) => {
    setSelectedHackathonDetail(hackathon);
  };

  const handleRegisterHackathon = (hackathonName: string) => {
    handleOpenJoin(hackathonName);
  };

  const handleRsvpSession = (session: SpeakerSession) => {
    setSelectedSessionRsvp(session);
  };

  const handleReadResource = (resource: ResourceItem) => {
    setSelectedResource(resource);
  };

  const handleOpenLegal = (type: "privacy" | "terms" | "code_of_conduct") => {
    setLegalModalType(type);
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Navbar */}
      <Navbar onJoinClick={() => handleOpenJoin()} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onJoinClick={() => handleOpenJoin()}
          onExploreHackathons={handleScrollToHackathons}
        />

        {/* 2. Trust Community Metrics */}
        <StatsSection />

        {/* 3. What is NEXHACK? (Pillars) */}
        <WhatIsNexhack onJoinClick={() => handleOpenJoin()} />

        {/* 4. Hackathons Showcase */}
        <HackathonsSection
          onViewHackathon={handleViewHackathon}
          onRegisterHackathon={handleRegisterHackathon}
        />

        {/* 5. Knowledge Sessions */}
        <KnowledgeSessionsSection onRsvpClick={handleRsvpSession} />

        {/* 6. Events & Experiences */}
        <EventsExperiencesSection onJoinClick={() => handleOpenJoin()} />

        {/* 7. Community & Node System */}
        <CommunityNetworkSection onJoinClick={() => handleOpenJoin()} />

        {/* 8. Campus Partners Section */}
        <CampusPartnersSection />

        {/* 9. Ecosystem Partners Logo Wall */}
        <EcosystemPartnersSection />

        {/* 10. Impact Timeline */}
        <ImpactTimelineSection />

        {/* 11. Testimonials */}
        <TestimonialsSection />

        {/* 12. Blog & Resources Hub */}
        <ResourcesSection onReadResource={handleReadResource} />

        {/* 13. FAQs */}
        <FaqSection />

        {/* 14. Newsletter & Final Call to Action */}
        <NewsletterCtaSection
          onJoinClick={() => handleOpenJoin()}
          onExploreEvents={handleScrollToHackathons}
        />
      </main>

      {/* Footer */}
      <Footer onOpenLegal={handleOpenLegal} onJoinClick={() => handleOpenJoin()} />

      {/* Modals */}
      <JoinCommunityModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        defaultEvent={selectedHackathonEvent}
      />

      <HackathonDetailModal
        isOpen={!!selectedHackathonDetail}
        onClose={() => setSelectedHackathonDetail(null)}
        hackathon={selectedHackathonDetail}
        onRegisterClick={(name) => handleOpenJoin(name)}
      />

      <SessionRsvpModal
        isOpen={!!selectedSessionRsvp}
        onClose={() => setSelectedSessionRsvp(null)}
        session={selectedSessionRsvp}
      />

      <ResourcePreviewModal
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        resource={selectedResource}
      />

      <LegalModal
        isOpen={!!legalModalType}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || "privacy"}
      />
    </div>
  );
}
