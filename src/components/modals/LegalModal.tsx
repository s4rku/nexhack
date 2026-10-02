"use client";

import React from "react";
import { Modal } from "../ui/Modal";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "privacy" | "terms" | "code_of_conduct";
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const content = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "Last updated: September 2026",
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            At <strong>NEXHACK</strong>, we respect the privacy of our student developers, mentors,
            and campus partners. This privacy statement outlines how we handle your information.
          </p>
          <h5 className="font-bold text-slate-900 text-sm">1. Information We Collect</h5>
          <p>
            When registering for NEXHACK events or joining our WhatsApp communities, we
            collect your full name, student email address, institution/school name, year of
            graduation, and technology interests.
          </p>
          <h5 className="font-bold text-slate-900 text-sm">2. How We Use Your Data</h5>
          <p>
            Your information is used solely to issue event tickets, coordinate team matching,
            distribute sponsor computing credits, and deliver mentorship opportunities. We do not
            sell personal information to third-party marketing companies.
          </p>
          <h5 className="font-bold text-slate-900 text-sm">3. Open Source & Projects</h5>
          <p>
            Hackathon submissions made to public GitHub repositories remain 100% intellectual
            property of the student authors and their squads.
          </p>
        </div>
      ),
    },
    terms: {
      title: "Community Terms & Conditions",
      subtitle: "Last updated: September 2026",
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Welcome to the <strong>NEXHACK Community Ecosystem</strong>. By participating in our
            hackathons, community channels, and workshops, you agree to these terms.
          </p>
          <h5 className="font-bold text-slate-900 text-sm">1. Eligibility</h5>
          <p>
            Participation is open to high school students, college undergraduates, graduate
            students, and recent graduates within 12 months of degree completion.
          </p>
          <h5 className="font-bold text-slate-900 text-sm">2. Originality of Hackathon Work</h5>
          <p>
            All core project development must occur during the specified hackathon sprint window.
            Using existing open-source libraries, APIs, and frameworks is permitted and encouraged,
            provided they are cited.
          </p>
          <h5 className="font-bold text-slate-900 text-sm">3. Equal Opportunity & Fair Play</h5>
          <p>
            NEXHACK enforces an uncompromising zero-tolerance policy against plagiarism,
            harassment, hate speech, or unfair exploitation.
          </p>
        </div>
      ),
    },
    code_of_conduct: {
      title: "Hacker Code of Conduct",
      subtitle: "Creating a safe, inclusive, and empowering community",
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            NEXHACK is dedicated to providing a harassment-free environment for everyone, regardless
            of gender, sexual orientation, disability, physical appearance, race, ethnicity, or
            programming background.
          </p>
          <h5 className="font-bold text-slate-900 text-sm">Be Respectful & Constructive</h5>
          <p>
            Be supportive of first-time hackers. Provide constructive feedback during code reviews,
            and respect project team decisions.
          </p>
          <h5 className="font-bold text-slate-900 text-sm">Reporting Violations</h5>
          <p>
            If you experience or witness any form of unacceptable behavior, notify a NEXHACK
            organizer or community moderator immediately at conduct@nexhack.in.
          </p>
        </div>
      ),
    },
  }[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={content.title}
      subtitle={content.subtitle}
      maxWidth="md"
    >
      <div className="py-2">{content.body}</div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          I Understand
        </button>
      </div>
    </Modal>
  );
};
