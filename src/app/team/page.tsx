"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalModal } from "@/components/modals/LegalModal";
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import {
  UsersRound, Plus, LogIn, Crown, Shield, User, Copy,
  Check, Trash2, LogOut, ArrowLeft, Loader2, AlertCircle,
  CheckCircle2, X, ChevronDown, ChevronUp, Sparkles,
  Lock, Unlock, Send, Clock, UserMinus, RefreshCw,
} from "lucide-react";
import type { DbTeam, DbTeamJoinRequest, DbTeamMember } from "@/lib/dbTypes";

/* ──────────────────────────────────────────────────────── helpers ── */
function Banner({ type, msg, onDismiss }: { type: "error" | "success"; msg: string; onDismiss?: () => void }) {
  const styles = type === "error"
    ? "bg-rose-50 border-rose-200 text-rose-700"
    : "bg-emerald-50 border-emerald-200 text-emerald-700";
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs ${styles}`}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <span className="flex-1">{msg}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 cursor-pointer opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
      )}
    </div>
  );
}

function MemberAvatar({ member, size = "sm" }: { member: DbTeamMember; size?: "sm" | "md" }) {
  const dim = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  if (member.avatarUrl) return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={member.avatarUrl} alt={member.displayName} className={`${dim} rounded-full object-cover border-2 border-white shadow-sm`} />
  );
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-sm flex items-center justify-center font-black text-white`}>
      {member.displayName[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function InviteCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold hover:bg-slate-700 transition-all cursor-pointer group"
    >
      <span className="tracking-widest">{code}</span>
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />}
    </button>
  );
}

/* ──────────────────────────────────────────────────── modal shells ── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── page ── */
export default function TeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  /* data */
  const [teams, setTeams] = useState<DbTeam[]>([]);
  const [requests, setRequests] = useState<DbTeamJoinRequest[]>([]); // user's outgoing requests
  const [incomingRequests, setIncomingRequests] = useState<Record<string, DbTeamJoinRequest[]>>({}); // teamId → requests
  const [openRequestPanel, setOpenRequestPanel] = useState<string | null>(null);

  /* loading / status */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  /* modal states */
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showRequest, setShowRequest] = useState<DbTeam | null>(null);

  /* create form */
  const [createForm, setCreateForm] = useState({ name: "", tagline: "", maxSize: "4" });
  /* join form */
  const [inviteCode, setInviteCode] = useState("");
  /* request form */
  const [requestTeamId, setRequestTeamId] = useState("");
  const [requestMsg, setRequestMsg] = useState("");

  const userId = session?.user?.id ?? "";

  /* ── redirect if unauthenticated ── */
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin?callbackUrl=/team");
  }, [status, router]);

  /* ── fetch user's teams + outgoing requests ── */
  const fetchTeams = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/user/teams");
      const data = await res.json();
      if (data.success) {
        setTeams(data.teams ?? []);
        setRequests(data.requests ?? []);
      }
    } catch {
      setError("Could not load your teams.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { if (status === "authenticated") fetchTeams(); }, [status, fetchTeams]);

  /* ── fetch incoming join requests for a captain's team ── */
  const fetchIncoming = useCallback(async (teamId: string) => {
    setActionLoading(`req-${teamId}`);
    try {
      const res = await fetch(`/api/user/teams/${teamId}/requests`);
      const data = await res.json();
      if (data.success) setIncomingRequests((p) => ({ ...p, [teamId]: data.requests }));
    } catch {}
    setActionLoading("");
  }, []);

  const toggleRequestPanel = useCallback((teamId: string) => {
    if (openRequestPanel === teamId) {
      setOpenRequestPanel(null);
    } else {
      setOpenRequestPanel(teamId);
      fetchIncoming(teamId);
    }
  }, [openRequestPanel, fetchIncoming]);

  /* ── helpers ── */
  const flash = (msg: string, type: "success" | "error" = "success") => {
    if (type === "success") { setSuccess(msg); setError(""); }
    else { setError(msg); setSuccess(""); }
    setTimeout(() => { setSuccess(""); setError(""); }, 4000);
  };

  /* ── create team ── */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    setActionLoading("create");
    try {
      const res = await fetch("/api/user/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setShowCreate(false);
      setCreateForm({ name: "", tagline: "", maxSize: "4" });
      flash("Team created! Share the invite code with your teammates.");
      await fetchTeams();
    } catch (err: any) {
      flash(err.message ?? "Could not create team", "error");
    }
    setActionLoading("");
  };

  /* ── join by invite code ── */
  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setActionLoading("join");
    try {
      const res = await fetch("/api/user/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setShowJoin(false);
      setInviteCode("");
      flash(`Joined "${data.team?.name}" successfully!`);
      await fetchTeams();
    } catch (err: any) {
      flash(err.message ?? "Could not join team", "error");
    }
    setActionLoading("");
  };

  /* ── send join request ── */
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const teamId = showRequest?.id ?? requestTeamId;
    if (!teamId) return;
    setActionLoading("request");
    try {
      const res = await fetch("/api/user/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, message: requestMsg }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setShowRequest(null);
      setRequestMsg("");
      flash("Join request sent! The captain will review it.");
      await fetchTeams();
    } catch (err: any) {
      flash(err.message ?? "Could not send request", "error");
    }
    setActionLoading("");
  };

  /* ── leave team ── */
  const handleLeave = async (teamId: string) => {
    if (!confirm("Leave this team? You won't be able to rejoin without a new invite.")) return;
    setActionLoading(`leave-${teamId}`);
    try {
      const res = await fetch(`/api/user/teams/${teamId}?action=leave`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      flash("You left the team.");
      await fetchTeams();
    } catch (err: any) {
      flash(err.message ?? "Could not leave team", "error");
    }
    setActionLoading("");
  };

  /* ── disband team ── */
  const handleDisband = async (teamId: string, teamName: string) => {
    if (!confirm(`Disband "${teamName}"? This removes all members and cannot be undone.`)) return;
    setActionLoading(`disband-${teamId}`);
    try {
      const res = await fetch(`/api/user/teams/${teamId}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      flash(`"${teamName}" has been disbanded.`);
      await fetchTeams();
    } catch (err: any) {
      flash(err.message ?? "Could not disband team", "error");
    }
    setActionLoading("");
  };

  /* ── remove member ── */
  const handleRemoveMember = async (teamId: string, targetId: string, name: string) => {
    if (!confirm(`Remove ${name} from the team?`)) return;
    setActionLoading(`remove-${targetId}`);
    try {
      const res = await fetch(`/api/user/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "removeMember", targetUserId: targetId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      flash(`${name} removed.`);
      await fetchTeams();
    } catch (err: any) {
      flash(err.message ?? "Could not remove member", "error");
    }
    setActionLoading("");
  };

  /* ── promote to captain ── */
  const handlePromote = async (teamId: string, targetId: string, name: string) => {
    if (!confirm(`Make ${name} the new captain? You'll become a regular member.`)) return;
    setActionLoading(`promote-${targetId}`);
    try {
      const res = await fetch(`/api/user/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "changeRole", targetUserId: targetId, role: "captain" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      flash(`${name} is now the captain!`);
      await fetchTeams();
    } catch (err: any) {
      flash(err.message ?? "Could not promote member", "error");
    }
    setActionLoading("");
  };

  /* ── toggle team open/closed ── */
  const handleToggleOpen = async (team: DbTeam) => {
    setActionLoading(`toggle-${team.id}`);
    try {
      const res = await fetch(`/api/user/teams/${team.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleOpen" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      flash(data.team?.isOpen ? "Team is now open to requests." : "Team is now closed.");
      await fetchTeams();
    } catch (err: any) {
      flash(err.message ?? "Could not update team", "error");
    }
    setActionLoading("");
  };

  /* ── respond to join request ── */
  const handleRespondRequest = async (teamId: string, requestId: string, action: "accept" | "reject", name: string) => {
    setActionLoading(`req-action-${requestId}`);
    try {
      const res = await fetch(`/api/user/teams/${teamId}/requests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      flash(action === "accept" ? `${name} added to the team!` : `Request from ${name} declined.`);
      await fetchTeams();
      await fetchIncoming(teamId);
    } catch (err: any) {
      flash(err.message ?? "Could not respond to request", "error");
    }
    setActionLoading("");
  };

  /* ── role badge ── */
  const RoleBadge = ({ role }: { role: "captain" | "member" }) =>
    role === "captain" ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
        <Crown className="w-2.5 h-2.5" /> Captain
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold">
        <User className="w-2.5 h-2.5" /> Member
      </span>
    );

  /* ── loading / unauthed ── */
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col selection:bg-blue-600 selection:text-white">
        <Navbar onJoinClick={() => setIsJoinOpen(true)} />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Loading your teams…</p>
          </div>
        </div>
      </div>
    );
  }
  if (status === "unauthenticated") return null;

  /* ── render ── */
  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />

      <main className="flex-1 pt-20 sm:pt-24 pb-16">

        {/* hero */}
        <section className="relative py-10 sm:py-14 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80 bg-tech-grid overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-400/8 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" /> Team Hub
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Team</h1>
                <p className="text-sm text-slate-500 mt-1">Build and manage your hackathon squad.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowJoin(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:text-blue-600 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" /> Join by Code
                </button>
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Team
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">

          {/* flash banners */}
          {error && <Banner type="error" msg={error} onDismiss={() => setError("")} />}
          {success && <Banner type="success" msg={success} onDismiss={() => setSuccess("")} />}

          {/* ── No teams yet ── */}
          {teams.length === 0 && requests.length === 0 && (
            <div className="text-center py-16 px-6 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center mx-auto mb-4">
                <UsersRound className="w-8 h-8 text-violet-500" />
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-1">You&apos;re not in a team yet</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                Create a team and invite your friends, or join an existing team with an invite code.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Create Team
                </button>
                <button onClick={() => setShowJoin(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:text-blue-600 text-slate-700 text-xs font-bold transition-all cursor-pointer">
                  <LogIn className="w-3.5 h-3.5" /> Join by Code
                </button>
              </div>
            </div>
          )}

          {/* ── Team cards ── */}
          {teams.map((team) => {
            const isCaptain = team.captainId === userId;
            const myRole = team.members.find((m) => m.userId === userId)?.role ?? "member";
            const isBusy = (key: string) => actionLoading === key;
            const pendingIncoming = incomingRequests[team.id] ?? [];

            return (
              <div key={team.id} className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                {/* card header */}
                <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-black text-slate-900 truncate">{team.name}</h2>
                      <RoleBadge role={myRole} />
                      {team.isOpen
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold"><Unlock className="w-2.5 h-2.5" /> Open</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-semibold"><Lock className="w-2.5 h-2.5" /> Closed</span>
                      }
                    </div>
                    {team.tagline && <p className="text-xs text-slate-500 mt-0.5">{team.tagline}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">{team.members.length}/{team.maxSize} members</p>
                  </div>

                  {/* invite code */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold mb-1">INVITE CODE</p>
                      <InviteCodeBadge code={team.inviteCode} />
                    </div>
                  </div>
                </div>

                {/* members list */}
                <div className="px-6 py-4 space-y-2">
                  {team.members.map((member) => (
                    <div key={member.userId} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors group">
                      <MemberAvatar member={member} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{member.displayName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                      </div>
                      <RoleBadge role={member.role} />

                      {/* Captain actions on other members */}
                      {isCaptain && member.userId !== userId && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handlePromote(team.id, member.userId, member.displayName)}
                            disabled={!!actionLoading}
                            title="Make captain"
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          >
                            {isBusy(`promote-${member.userId}`) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crown className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleRemoveMember(team.id, member.userId, member.displayName)}
                            disabled={!!actionLoading}
                            title="Remove member"
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          >
                            {isBusy(`remove-${member.userId}`) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserMinus className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* captain controls footer */}
                {isCaptain && (
                  <div className="px-6 py-4 border-t border-slate-100 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* toggle open */}
                      <button
                        onClick={() => handleToggleOpen(team)}
                        disabled={!!actionLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs font-semibold bg-white transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isBusy(`toggle-${team.id}`) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : team.isOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        {team.isOpen ? "Close to requests" : "Open to requests"}
                      </button>

                      {/* refresh */}
                      <button
                        onClick={() => fetchTeams()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs font-semibold bg-white transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                      </button>

                      {/* join requests toggle */}
                      <button
                        onClick={() => toggleRequestPanel(team.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold transition-all cursor-pointer"
                      >
                        {isBusy(`req-${team.id}`) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                        Join Requests
                        {openRequestPanel === team.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {/* disband — separated to the right */}
                      <button
                        onClick={() => handleDisband(team.id, team.name)}
                        disabled={!!actionLoading}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isBusy(`disband-${team.id}`) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        Disband Team
                      </button>
                    </div>

                    {/* Incoming join requests panel */}
                    {openRequestPanel === team.id && (
                      <div className="mt-2 rounded-2xl border border-violet-100 bg-violet-50/50 p-4 space-y-3">
                        <p className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-violet-600" />
                          Pending Requests {pendingIncoming.length > 0 && `(${pendingIncoming.length})`}
                        </p>
                        {pendingIncoming.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-3">No pending requests right now.</p>
                        ) : (
                          pendingIncoming.map((req) => (
                            <div key={req.id} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                                {req.userDisplayName[0]?.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800">{req.userDisplayName}</p>
                                <p className="text-[10px] text-slate-500">{req.userEmail}</p>
                                {req.message && <p className="text-[11px] text-slate-600 mt-1 italic">&ldquo;{req.message}&rdquo;</p>}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleRespondRequest(team.id, req.id, "accept", req.userDisplayName)}
                                  disabled={!!actionLoading}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 cursor-pointer disabled:opacity-50 transition-colors"
                                  title="Accept"
                                >
                                  {isBusy(`req-action-${req.id}`) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleRespondRequest(team.id, req.id, "reject", req.userDisplayName)}
                                  disabled={!!actionLoading}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer disabled:opacity-50 transition-colors"
                                  title="Decline"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* non-captain member leave */}
                {!isCaptain && (
                  <div className="px-6 py-3 border-t border-slate-100">
                    <button
                      onClick={() => handleLeave(team.id)}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isBusy(`leave-${team.id}`) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                      Leave Team
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* ── Outgoing requests ── */}
          {requests.filter((r) => r.status === "Pending").length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-slate-500" /> Pending Join Requests
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {requests.filter((r) => r.status === "Pending").map((req) => (
                  <div key={req.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">Request to join <span className="text-blue-600">{req.teamName}</span></p>
                      {req.message && <p className="text-[10px] text-slate-500 truncate italic">&ldquo;{req.message}&rdquo;</p>}
                    </div>
                    <span className="shrink-0 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Create Team Modal ── */}
      {showCreate && (
        <Modal title="Create a New Team" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Team Name *</label>
              <input
                type="text" required autoFocus maxLength={40}
                value={createForm.name}
                onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Neural Ninjas"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tagline</label>
              <input
                type="text" maxLength={80}
                value={createForm.tagline}
                onChange={(e) => setCreateForm((p) => ({ ...p, tagline: e.target.value }))}
                placeholder="A short motto or description"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Max Team Size</label>
              <select
                value={createForm.maxSize}
                onChange={(e) => setCreateForm((p) => ({ ...p, maxSize: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                {[2,3,4,5,6].map((n) => <option key={n} value={n}>{n} members</option>)}
              </select>
            </div>
            <div className="pt-2 flex gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
              <button type="submit" disabled={actionLoading === "create"} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed">
                {actionLoading === "create" ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <><Plus className="w-4 h-4" /> Create Team</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Join by Code Modal ── */}
      {showJoin && (
        <Modal title="Join a Team" onClose={() => setShowJoin(false)}>
          <form onSubmit={handleJoinByCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Invite Code</label>
              <input
                type="text" required autoFocus maxLength={8}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. AB12CD"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all tracking-widest"
              />
              <p className="text-[10px] text-slate-400">Ask your team captain for their 6-character invite code.</p>
            </div>
            <div className="pt-1 space-y-2">
              <div className="text-center">
                <p className="text-[11px] text-slate-400 font-semibold">— or —</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Send Join Request by Team ID</label>
                <input
                  type="text"
                  value={requestTeamId}
                  onChange={(e) => setRequestTeamId(e.target.value)}
                  placeholder="team-1234567890"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <input
                  type="text"
                  value={requestMsg}
                  onChange={(e) => setRequestMsg(e.target.value)}
                  placeholder="Optional message to the captain"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="pt-2 flex gap-2">
              <button type="button" onClick={() => setShowJoin(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
              {inviteCode.length >= 4 ? (
                <button type="submit" disabled={actionLoading === "join"} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed">
                  {actionLoading === "join" ? <><Loader2 className="w-4 h-4 animate-spin" /> Joining…</> : <><LogIn className="w-4 h-4" /> Join Team</>}
                </button>
              ) : (
                <button type="button" disabled={!requestTeamId.trim() || actionLoading === "request"} onClick={handleSendRequest} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed">
                  {actionLoading === "request" ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send Request</>}
                </button>
              )}
            </div>
          </form>
        </Modal>
      )}

      <Footer onOpenLegal={(type) => setLegalModalType(type)} onJoinClick={() => setIsJoinOpen(true)} />
      <JoinCommunityModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <LegalModal isOpen={!!legalModalType} onClose={() => setLegalModalType(null)} type={legalModalType || "privacy"} />
    </div>
  );
}
