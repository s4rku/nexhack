"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Terminal,
  Trophy,
  Calendar,
  Users,
  BookOpen,
  Info,
  Building2,
} from "lucide-react";
import { NexhackLogo } from "../ui/NexhackLogo";

interface NavbarProps {
  onJoinClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/", icon: Terminal },
    { label: "Hackathons", href: "/hackathons", icon: Trophy },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Community", href: "/community", icon: Users },
    { label: "About", href: "/about", icon: Info },
    { label: "Resources", href: "/resources", icon: BookOpen },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-2.5 sm:py-3"
            : "bg-white/80 backdrop-blur-xs py-3 sm:py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-hidden shrink-0"
              aria-label="NEXHACK Home"
            >
              <NexhackLogo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50/80 border border-slate-200/80 shadow-2xs">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? "text-blue-600 bg-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Button Desktop */}
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                href="/campus"
                className={`text-xs font-bold px-2.5 py-1.5 transition-colors hidden md:block rounded-lg ${
                  pathname === "/campus"
                    ? "text-blue-600 bg-blue-50 font-extrabold"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                Host on Campus
              </Link>

              <button
                onClick={onJoinClick}
                className="group relative inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white text-xs font-bold tracking-wide shadow-md shadow-blue-500/20 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Join Community</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Mobile Actions Button */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                onClick={onJoinClick}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Join
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-3 right-3 max-h-[85vh] bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200 overflow-y-auto space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <NexhackLogo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/campus"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  pathname === "/campus"
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Host on Campus</span>
              </Link>
            </nav>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onJoinClick?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Join Community Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
