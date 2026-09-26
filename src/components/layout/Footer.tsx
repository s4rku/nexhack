"use client";

import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/data/nexhackData";
import {
  DiscordIcon,
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon,
  XTwitterIcon,
  GitHubIcon,
} from "@/components/ui/SocialIcons";
import { NexhackLogo } from "../ui/NexhackLogo";

interface FooterProps {
  onOpenLegal: (type: "privacy" | "terms" | "code_of_conduct") => void;
  onJoinClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onJoinClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 sm:pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="sm:col-span-2 space-y-3.5">
            <Link href="/" className="flex items-center gap-2 group focus:outline-hidden">
              <NexhackLogo size="md" inverted={true} />
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A student-driven community building the next generation of innovators through
              hackathons, technical workshops, knowledge sessions, and collaborative experiences.
            </p>

            <div className="flex items-center flex-wrap gap-2.5 pt-1">
              <a
                href={SITE_CONFIG.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                aria-label="Discord"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <XTwitterIcon className="w-4 h-4" />
              </a>
              <a
                href={SITE_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">Explore</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/hackathons" className="hover:text-blue-400 transition-colors">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-blue-400 transition-colors">
                  Events & Sprints
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-blue-400 transition-colors">
                  Community Network
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-blue-400 transition-colors">
                  Developer Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Organization */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">
              Organization
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About NEXHACK
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-blue-400 transition-colors">
                  Partner With Us (Campus)
                </Link>
              </li>
              <li>
                <button
                  onClick={onJoinClick}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Join Community
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Email
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal("code_of_conduct")}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Code of Conduct
                </button>
              </li>
              <li className="pt-1">
                <Link
                  href="/admin"
                  className="text-slate-500 hover:text-blue-400 font-mono text-[11px] transition-colors flex items-center gap-1"
                >
                  <span>Admin Portal</span>
                  <span>&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">
              Community Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href={SITE_CONFIG.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <DiscordIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 text-blue-400" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <XTwitterIcon className="w-3.5 h-3.5 text-slate-400" />
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <div>
            <span>© {SITE_CONFIG.currentYear} NEXHACK. Built for students.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onOpenLegal("privacy")}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal("terms")}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegal("code_of_conduct")}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Code of Conduct
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
