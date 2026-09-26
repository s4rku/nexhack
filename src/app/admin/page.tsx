"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  DbHackathon,
  DbEventSession,
  DbRegistration,
  DbCampusInquiry,
  DbNewsletter,
  DbAdminLog,
} from "@/lib/dbTypes";
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  Users,
  Building2,
  Mail,
  Shield,
  Activity,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  ExternalLink,
  Lock,
  Unlock,
  RefreshCw,
  Database,
  ArrowRight,
  AlertCircle,
  Eye,
  X,
  UploadCloud,
  Copy,
  Sparkles,
  KeyRound,
  Send,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { NexhackLogo } from "@/components/ui/NexhackLogo";
import { ImageUpload } from "@/components/ui/ImageUpload";

export default function AdminPage() {
  // Authentication & OTP states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [otpStep, setOtpStep] = useState<"email" | "otp">("email");
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [devOtpSnippet, setDevOtpSnippet] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "hackathons" | "events" | "inquiries" | "registrations" | "newsletters" | "logs" | "media"
  >("overview");

  // Media tab state
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; date: string }[]>([]);
  const [activeMediaUrl, setActiveMediaUrl] = useState("");

  // Data states
  const [stats, setStats] = useState({
    hackathons: 0,
    events: 0,
    registrations: 0,
    inquiries: 0,
    newsletters: 0,
    isUsingMongo: false,
  });
  const [hackathons, setHackathons] = useState<DbHackathon[]>([]);
  const [events, setEvents] = useState<DbEventSession[]>([]);
  const [registrations, setRegistrations] = useState<DbRegistration[]>([]);
  const [inquiries, setInquiries] = useState<DbCampusInquiry[]>([]);
  const [newsletters, setNewsletters] = useState<DbNewsletter[]>([]);
  const [logs, setLogs] = useState<DbAdminLog[]>([]);

  // Search & Filters
  const [regSearch, setRegSearch] = useState("");
  const [inqFilter, setInqFilter] = useState("All");

  // UI Modals in Admin
  const [isAddHackathonOpen, setIsAddHackathonOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<DbCampusInquiry | null>(null);

  // Forms
  const [newHackathon, setNewHackathon] = useState({
    name: "",
    edition: "Regional Sprint",
    tagline: "",
    description: "",
    status: "Upcoming" as const,
    mode: "Hybrid" as const,
    location: "Bengaluru",
    dateRange: "",
    prizePool: "Cash Grants & Swag",
    tags: "AI, Web, Open Innovation",
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "Web Development" as const,
    speakerName: "",
    speakerRole: "Tech Lead",
    speakerCompany: "NEXHACK Mentor",
    avatar: "",
    date: "",
    time: "6:00 PM IST",
    duration: "60 mins",
    mode: "Virtual Workshop" as const,
    seatsLeft: 100,
    level: "Beginner" as const,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  // Check persisted admin session
  useEffect(() => {
    const saved = localStorage.getItem("nexhack_admin_session");
    if (saved) {
      setIsAuthenticated(true);
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!adminEmail || !adminEmail.includes("@")) {
      setAuthError("Please enter a valid admin email address.");
      return;
    }
    setIsSendingOtp(true);
    setAuthError("");
    setOtpMessage("");
    setDevOtpSnippet("");

    try {
      const res = await fetch("/api/admin/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, passcode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch verification OTP.");
      }

      setOtpStep("otp");
      setOtpMessage(data.message || `A 6-digit OTP code has been sent to ${adminEmail}.`);
      if (data.devOtp) {
        setDevOtpSnippet(data.devOtp);
      }
      setResendCooldown(60);
    } catch (err: any) {
      setAuthError(err.message || "Could not send OTP. Check your internet connection.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setAuthError("Please enter the 6-digit code received on your email.");
      return;
    }
    setIsVerifyingOtp(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Verification failed. Invalid or expired OTP.");
      }

      setIsAuthenticated(true);
      localStorage.setItem("nexhack_admin_session", data.token || "valid");
      localStorage.setItem("nexhack_admin_email", data.email || adminEmail);
      showNotice("Identity verified successfully! Welcome to the Admin Command Center.");
      fetchData();
    } catch (err: any) {
      setAuthError(err.message || "Invalid OTP code.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("nexhack_admin_session");
    localStorage.removeItem("nexhack_admin_email");
    setOtpStep("email");
    setOtpCode("");
    setDevOtpSnippet("");
  };

  // Fetch all collections
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, hackRes, evtRes, regRes, inqRes, newsRes, logsRes] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/hackathons").then((r) => r.json()),
        fetch("/api/admin/events").then((r) => r.json()),
        fetch("/api/admin/registrations").then((r) => r.json()),
        fetch("/api/admin/inquiries").then((r) => r.json()),
        fetch("/api/admin/newsletters").then((r) => r.json()),
        fetch("/api/admin/logs").then((r) => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (hackRes.success) setHackathons(hackRes.hackathons);
      if (evtRes.success) setEvents(evtRes.events);
      if (regRes.success) setRegistrations(regRes.registrations);
      if (inqRes.success) setInquiries(inqRes.inquiries);
      if (newsRes.success) setNewsletters(newsRes.newsletters);
      if (logsRes.success) setLogs(logsRes.logs);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Notice banner helper
  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(""), 3500);
  };

  // Action handlers
  const handleCreateHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newHackathon,
      tags: newHackathon.tags.split(",").map((s) => s.trim()),
    };
    const res = await fetch("/api/admin/hackathons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setIsAddHackathonOpen(false);
      showNotice("Hackathon created successfully in MongoDB!");
      fetchData();
    }
  };

  const handleDeleteHackathon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hackathon?")) return;
    const res = await fetch(`/api/admin/hackathons?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showNotice("Hackathon deleted.");
      fetchData();
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newEvent.title,
      category: newEvent.category,
      speaker: {
        name: newEvent.speakerName || "NEXHACK Mentor",
        role: newEvent.speakerRole,
        company: newEvent.speakerCompany,
        avatar: newEvent.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        verified: true,
      },
      date: newEvent.date || "Upcoming Saturday",
      time: newEvent.time,
      duration: newEvent.duration,
      mode: newEvent.mode,
      seatsLeft: Number(newEvent.seatsLeft),
      level: newEvent.level,
      highlights: ["Hands-on code lab", "Production deployment"],
    };
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setIsAddEventOpen(false);
      showNotice("Event created successfully in MongoDB!");
      fetchData();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workshop?")) return;
    const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showNotice("Event removed.");
      fetchData();
    }
  };

  const handleUpdateRegStatus = async (id: string, status: DbRegistration["status"]) => {
    const res = await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      showNotice(`Registration ${id} updated to ${status}.`);
      fetchData();
    }
  };

  const handleUpdateInqStatus = async (id: string, status: DbCampusInquiry["status"]) => {
    const res = await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      showNotice(`Inquiry status updated to ${status}.`);
      fetchData();
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    const res = await fetch(`/api/admin/registrations?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showNotice("Registration deleted.");
      fetchData();
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campus inquiry?")) return;
    const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showNotice("Campus inquiry deleted.");
      fetchData();
    }
  };

  const handleDeleteNewsletter = async (idOrEmail: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;
    const res = await fetch(`/api/admin/newsletters?id=${encodeURIComponent(idOrEmail)}`, { method: "DELETE" });
    if (res.ok) {
      showNotice("Subscriber removed.");
      fetchData();
    }
  };


  // Export registrations to CSV
  const handleExportRegistrations = () => {
    const headers = ["ID", "Full Name", "Email", "Phone", "Institution", "Event", "Role", "Status", "Date"];
    const rows = registrations.map((r) => [
      r.id,
      `"${r.fullName}"`,
      r.email,
      r.phone || "",
      `"${r.collegeOrSchool}"`,
      `"${r.eventOrHackathon}"`,
      r.role,
      r.status,
      r.createdAt,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexhack_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    if (!regSearch.trim()) return registrations;
    const q = regSearch.toLowerCase();
    return registrations.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.collegeOrSchool.toLowerCase().includes(q) ||
        r.eventOrHackathon.toLowerCase().includes(q)
    );
  }, [registrations, regSearch]);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    if (inqFilter === "All") return inquiries;
    return inquiries.filter((i) => i.status === inqFilter);
  }, [inquiries, inqFilter]);

  // If not logged in, render Email OTP authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
        <div className="max-w-md w-full bg-slate-800/90 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <NexhackLogo size="lg" inverted={true} className="justify-center" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-mono font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>Two-Factor Security Authentication</span>
            </div>
            <h1 className="text-2xl font-black text-white">Admin Command Center</h1>
            <p className="text-xs text-slate-400">
              {otpStep === "email"
                ? "Enter your admin credentials to receive a single-use 6-digit email OTP."
                : `Enter the 6-digit security code dispatched to ${adminEmail}.`}
            </p>
          </div>

          {/* STEP 1: EMAIL & PASSCODE */}
          {otpStep === "email" && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="e.g. admin@nexhack.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Master Passcode (Optional)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="e.g. nexhack_admin_2026"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Default passcode: <code className="text-blue-400">nexhack_admin_2026</code>
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Security OTP...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: ENTER 6-DIGIT OTP */}
          {otpStep === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep("email");
                    setAuthError("");
                  }}
                  className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>
                <span className="font-mono text-slate-400 truncate max-w-[200px]">{adminEmail}</span>
              </div>

              {/* Dev mode helper badge */}
              {devOtpSnippet && (
                <div
                  onClick={() => setOtpCode(devOtpSnippet)}
                  className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs cursor-pointer hover:bg-blue-500/20 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Local Test OTP (Click to Fill)</span>
                    </span>
                    <span className="font-mono tracking-widest text-emerald-400 text-sm">{devOtpSnippet}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    SMTP credentials not set yet in .env.local — OTP logged to server terminal.
                  </p>
                </div>
              )}

              {otpMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{otpMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Enter 6-Digit Security Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono text-xl tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify & Access Admin Console</span>
                  </>
                )}
              </button>

              {/* Resend Link */}
              <div className="text-center pt-1 text-xs text-slate-400">
                {resendCooldown > 0 ? (
                  <span>Resend verification code in <strong className="text-blue-400">{resendCooldown}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    disabled={isSendingOtp}
                    className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline"
                  >
                    Didn&apos;t receive code? Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              &larr; Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. TOP STATUS BAR */}
      <header className="bg-slate-800/80 border-b border-slate-700/80 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <NexhackLogo size="sm" inverted={true} showTagline={false} />
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">
              Admin
            </span>
          </Link>

          {/* Database indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono text-slate-300">
              {stats.isUsingMongo ? "MongoDB Connected" : "Local In-Memory Cache Active"}
            </span>
            <span className={`w-2 h-2 rounded-full ${stats.isUsingMongo ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all cursor-pointer"
          >
            Lock
          </button>
        </div>
      </header>

      {/* Action Notice Toast */}
      {actionNotice && (
        <div className="bg-emerald-500 text-slate-950 font-bold text-xs py-2 px-4 text-center animate-in fade-in duration-200">
          ✓ {actionNotice}
        </div>
      )}

      {/* 2. MAIN LAYOUT WITH SIDEBAR */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-slate-800/40 border-r border-slate-700/60 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3">
              Management
            </span>
            <nav className="flex flex-col gap-1 pt-1">
              {[
                { id: "overview", label: "Dashboard", icon: LayoutDashboard, count: null },
                { id: "hackathons", label: "Hackathons", icon: Trophy, count: stats.hackathons },
                { id: "events", label: "Events & Workshops", icon: Calendar, count: stats.events },
                { id: "registrations", label: "Registrations", icon: Users, count: stats.registrations },
                { id: "inquiries", label: "Campus Inquiries", icon: Building2, count: stats.inquiries },
                { id: "newsletters", label: "Subscribers", icon: Mail, count: stats.newsletters },
                { id: "media", label: "Media & Cloudinary", icon: UploadCloud, count: null },
                { id: "logs", label: "Audit Logs", icon: Activity, count: null },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions Card */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              Fast Create
            </span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsAddHackathonOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hackathon</span>
              </button>
              <button
                onClick={() => setIsAddEventOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Workshop</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl overflow-x-hidden">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white">Ecosystem Overview</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time activity and metrics powered by MongoDB.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-5 rounded-3xl bg-slate-800 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-blue-400">
                    <Trophy className="w-5 h-5" />
                    <span className="text-[10px] font-mono uppercase">EDITIONS</span>
                  </div>
                  <div className="text-2xl font-black text-white">{stats.hackathons}</div>
                  <div className="text-[11px] text-slate-400">Hackathon sprints</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-800 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-purple-400">
                    <Calendar className="w-5 h-5" />
                    <span className="text-[10px] font-mono uppercase">SESSIONS</span>
                  </div>
                  <div className="text-2xl font-black text-white">{stats.events}</div>
                  <div className="text-[11px] text-slate-400">Live workshops</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-800 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400">
                    <Users className="w-5 h-5" />
                    <span className="text-[10px] font-mono uppercase">STUDENTS</span>
                  </div>
                  <div className="text-2xl font-black text-white">{stats.registrations}</div>
                  <div className="text-[11px] text-slate-400">Total registrations</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-800 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-cyan-400">
                    <Building2 className="w-5 h-5" />
                    <span className="text-[10px] font-mono uppercase">CAMPUSES</span>
                  </div>
                  <div className="text-2xl font-black text-white">{stats.inquiries}</div>
                  <div className="text-[11px] text-slate-400">Partnership inquiries</div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-800 border border-slate-700 space-y-2 col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between text-amber-400">
                    <Mail className="w-5 h-5" />
                    <span className="text-[10px] font-mono uppercase">MAILING</span>
                  </div>
                  <div className="text-2xl font-black text-white">{stats.newsletters}</div>
                  <div className="text-[11px] text-slate-400">Newsletter subs</div>
                </div>
              </div>

              {/* Recent Tables Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Registrations */}
                <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Recent Student Signups</h3>
                    <button
                      onClick={() => setActiveTab("registrations")}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                    >
                      View All &rarr;
                    </button>
                  </div>
                  <div className="space-y-2">
                    {registrations.slice(0, 4).map((reg) => (
                      <div
                        key={reg.id}
                        className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-white">{reg.fullName}</p>
                          <p className="text-[11px] text-slate-400">{reg.collegeOrSchool} • {reg.eventOrHackathon}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {reg.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Campus Inquiries */}
                <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Recent Campus Inquiries</h3>
                    <button
                      onClick={() => setActiveTab("inquiries")}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      View All &rarr;
                    </button>
                  </div>
                  <div className="space-y-2">
                    {inquiries.slice(0, 4).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-white">{inq.institutionName}</p>
                          <p className="text-[11px] text-slate-400">{inq.contactName} • {inq.city}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HACKATHONS */}
          {activeTab === "hackathons" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Hackathons Directory</h2>
                  <p className="text-xs text-slate-400 mt-1">Manage all competition editions and tracks.</p>
                </div>
                <button
                  onClick={() => setIsAddHackathonOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Hackathon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {hackathons.map((h) => (
                  <div
                    key={h.id}
                    className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                          {h.edition}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                          {h.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white">{h.name}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2">{h.description}</p>
                      <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-700">
                        <div>Dates: <span className="text-white">{h.dateRange}</span></div>
                        <div>Mode: <span className="text-white">{h.mode}</span> ({h.location})</div>
                        <div>Prize Pool: <span className="text-emerald-400 font-bold">{h.prizePool}</span></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteHackathon(h.id)}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-all cursor-pointer"
                        title="Delete hackathon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {h.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EVENTS & WORKSHOPS */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Events & Code Labs</h2>
                  <p className="text-xs text-slate-400 mt-1">Manage workshop calendar, speakers, and seat quotas.</p>
                </div>
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Workshop</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map((e) => (
                  <div
                    key={e.id}
                    className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          {e.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{e.level}</span>
                      </div>
                      <h3 className="text-base font-bold text-white line-clamp-2">{e.title}</h3>
                      <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-700">
                        <div>Mentor: <span className="text-white">{e.speaker?.name}</span></div>
                        <div>Date & Time: <span className="text-white">{e.date} • {e.time}</span></div>
                        <div>Seats Left: <span className="text-cyan-400 font-bold">{e.seatsLeft}</span></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteEvent(e.id)}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-all cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {e.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REGISTRATIONS */}
          {activeTab === "registrations" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Student Registrations</h2>
                  <p className="text-xs text-slate-400 mt-1">Live signups for hackathons, workshops, and chapters.</p>
                </div>
                <button
                  onClick={handleExportRegistrations}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer w-fit"
                >
                  <Download className="w-4 h-4" />
                  <span>Export to CSV</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, college, email, or event..."
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Table */}
              <div className="rounded-3xl bg-slate-800 border border-slate-700 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="p-4">Student</th>
                      <th className="p-4">Institution</th>
                      <th className="p-4">Event / Sprint</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredRegistrations.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white">{r.fullName}</p>
                          <p className="text-[11px] text-slate-400">{r.email}</p>
                          {r.phone && <p className="text-[10px] text-slate-500">{r.phone}</p>}
                        </td>
                        <td className="p-4">
                          <p className="text-white">{r.collegeOrSchool}</p>
                          {r.degreeOrGrade && <p className="text-[10px] text-slate-400">{r.degreeOrGrade}</p>}
                        </td>
                        <td className="p-4 font-semibold text-blue-400">{r.eventOrHackathon}</td>
                        <td className="p-4 text-slate-300">{r.role}</td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              r.status === "Confirmed" || r.status === "Approved"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : r.status === "Waitlisted"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <select
                            value={r.status}
                            onChange={(e) => handleUpdateRegStatus(r.id, e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 text-[11px] text-white rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Approved">Approved</option>
                            <option value="Waitlisted">Waitlisted</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleDeleteRegistration(r.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer inline-flex items-center"
                            title="Delete registration"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CAMPUS INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Campus Partnership Requests</h2>
                  <p className="text-xs text-slate-400 mt-1">Colleges and school societies applying for co-branded sprints.</p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                  {["All", "Pending", "Contacted", "Approved"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setInqFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        inqFilter === st ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="rounded-3xl bg-slate-800 border border-slate-700 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="p-4">Institution</th>
                      <th className="p-4">Representative</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Reach</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white">{inq.institutionName}</p>
                          <p className="text-[11px] text-slate-400">{inq.city}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-white font-medium">{inq.contactName}</p>
                          <a
                            href={`mailto:${inq.contactEmail}`}
                            className="text-[11px] text-blue-400 hover:underline"
                          >
                            {inq.contactEmail}
                          </a>
                        </td>
                        <td className="p-4 text-slate-300 font-semibold">{inq.partnershipType}</td>
                        <td className="p-4 text-cyan-400">{inq.expectedStudents}</td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              inq.status === "Approved"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : inq.status === "Contacted"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white cursor-pointer"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInqStatus(inq.id, e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 text-[11px] text-white rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Approved">Approved</option>
                            <option value="Archived">Archived</option>
                          </select>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer inline-flex items-center"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SUBSCRIBERS */}
          {activeTab === "newsletters" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Mailing List Subscribers</h2>
                <p className="text-xs text-slate-400 mt-1">Verified email addresses subscribed to community updates.</p>
              </div>

              <div className="rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="p-4">Email</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Subscribed Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {newsletters.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-700/30">
                        <td className="p-4 font-bold text-white">{sub.email}</td>
                        <td className="p-4 text-slate-400">{sub.source}</td>
                        <td className="p-4 text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteNewsletter(sub.id || sub.email)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer inline-flex items-center"
                            title="Delete subscriber"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">System Activity & Audit Trail</h2>
                <p className="text-xs text-slate-400 mt-1">Immutable ledger of administrative mutations and submissions.</p>
              </div>

              <div className="rounded-3xl bg-slate-800 border border-slate-700 divide-y divide-slate-700/60 overflow-hidden">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-white">{log.action}</p>
                      <p className="text-[11px] text-slate-400">Target: <span className="text-blue-400">{log.target}</span></p>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                      <p className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: MEDIA & CLOUDINARY UPLOADS */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                  <UploadCloud className="w-6 h-6 text-blue-400" />
                  <span>Cloudinary Media & Asset Manager</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload speaker photos, event banners, society logos, and sponsor graphics directly to Cloudinary CDN with automatic WebP optimization.
                </p>
              </div>

              {/* Upload Card */}
              <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Upload New Image</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    CDN: res.cloudinary.com
                  </span>
                </div>

                <ImageUpload
                  value={activeMediaUrl}
                  onChange={(url) => {
                    setActiveMediaUrl(url);
                    if (url) {
                      setUploadedMedia((prev) => [
                        { url, date: new Date().toLocaleTimeString() },
                        ...prev.filter((m) => m.url !== url),
                      ]);
                      showNotice("Image successfully uploaded to Cloudinary!");
                    }
                  }}
                  label="Drop or Select Image to Upload"
                  folder="nexhack/media"
                />

                {activeMediaUrl && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400">✓ Uploaded Image URL</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(activeMediaUrl);
                          showNotice("Cloudinary URL copied to clipboard!");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={activeMediaUrl}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 select-all"
                    />
                  </div>
                )}
              </div>

              {/* Uploaded History in Session */}
              {uploadedMedia.length > 0 && (
                <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
                  <h3 className="text-sm font-bold text-white">Recent Uploads in this Session</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedMedia.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-900 border border-slate-750 flex flex-col gap-2.5"
                      >
                        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.url}
                            alt="Uploaded Cloudinary asset"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">{m.date}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(m.url);
                              showNotice("URL copied to clipboard!");
                            }}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Setup Information Note */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-2">
                <p className="font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  <span>Cloudinary Credentials Configuration</span>
                </p>
                <p>
                  Images uploaded through this portal or the Workshop Speaker creator are stored permanently in your Cloudinary media library.
                  Ensure the following variables are configured in your <code className="text-blue-300">.env.local</code> file:
                </p>
                <pre className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-850">
{`CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD HACKATHON */}
      {isAddHackathonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Create New Hackathon</h3>
              <button
                onClick={() => setIsAddHackathonOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHackathon} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Hackathon Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NEXHACK AI Sprint 2026"
                  value={newHackathon.name}
                  onChange={(e) => setNewHackathon({ ...newHackathon, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Edition</label>
                  <input
                    type="text"
                    placeholder="e.g. Flagship / Regional"
                    value={newHackathon.edition}
                    onChange={(e) => setNewHackathon({ ...newHackathon, edition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Status</label>
                  <select
                    value={newHackathon.status}
                    onChange={(e) => setNewHackathon({ ...newHackathon, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Format Mode</label>
                  <select
                    value={newHackathon.mode}
                    onChange={(e) => setNewHackathon({ ...newHackathon, mode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Online">Online / Virtual</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={newHackathon.location}
                    onChange={(e) => setNewHackathon({ ...newHackathon, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Date Range</label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 14 - 16, 2026"
                    value={newHackathon.dateRange}
                    onChange={(e) => setNewHackathon({ ...newHackathon, dateRange: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Prize Pool</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,00,000 + Swag"
                    value={newHackathon.prizePool}
                    onChange={(e) => setNewHackathon({ ...newHackathon, prizePool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Build The Next Frontier"
                  value={newHackathon.tagline}
                  onChange={(e) => setNewHackathon({ ...newHackathon, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the sprint scope..."
                  value={newHackathon.description}
                  onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="AI, Web3, Full Stack"
                  value={newHackathon.tags}
                  onChange={(e) => setNewHackathon({ ...newHackathon, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                Save Hackathon to MongoDB
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD EVENT */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Create New Workshop / Masterclass</h3>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Workshop Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 16 Edge Architecture Code-Along"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Startups & Career">Startups & Career</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Skill Level</label>
                  <select
                    value={newEvent.level}
                    onChange={(e) => setNewEvent({ ...newEvent, level: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Speaker / Mentor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Siddharth Rao"
                    value={newEvent.speakerName}
                    onChange={(e) => setNewEvent({ ...newEvent, speakerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Speaker Role & Org</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend Engineer"
                    value={newEvent.speakerRole}
                    onChange={(e) => setNewEvent({ ...newEvent, speakerRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Saturday, 6 PM"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 60 mins"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Seats Quota</label>
                  <input
                    type="number"
                    value={newEvent.seatsLeft}
                    onChange={(e) => setNewEvent({ ...newEvent, seatsLeft: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Cloudinary Speaker Avatar Upload */}
              <div className="pt-1">
                <ImageUpload
                  value={newEvent.avatar}
                  onChange={(url) => setNewEvent({ ...newEvent, avatar: url })}
                  label="Speaker Avatar Photo (Stored in Cloudinary)"
                  folder="nexhack/speakers"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                Save Event to MongoDB
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INQUIRY DETAIL MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                {selectedInquiry.status}
              </span>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{selectedInquiry.institutionName}</h3>
              <p className="text-xs text-slate-400">{selectedInquiry.city}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 space-y-2 text-xs text-slate-300">
              <div>Representative: <strong className="text-white">{selectedInquiry.contactName}</strong></div>
              <div>Email: <a href={`mailto:${selectedInquiry.contactEmail}`} className="text-blue-400 underline">{selectedInquiry.contactEmail}</a></div>
              <div>Partnership Type: <span className="text-white font-semibold">{selectedInquiry.partnershipType}</span></div>
              <div>Expected Student Reach: <span className="text-emerald-400">{selectedInquiry.expectedStudents}</span></div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block mb-1">Institution Notes:</span>
                <p className="text-white bg-slate-800/80 p-3 rounded-xl leading-relaxed italic">
                  &ldquo;{selectedInquiry.notes || "No additional notes provided."}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={`mailto:${selectedInquiry.contactEmail}?subject=NEXHACK%20Campus%20Collaboration%20-%20${encodeURIComponent(selectedInquiry.institutionName)}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Reply via Email
              </a>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
