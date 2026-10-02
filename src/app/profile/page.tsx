"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalModal } from "@/components/modals/LegalModal";
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import {
  User, Mail, BookOpen, GraduationCap, Building2,
  GitFork, Link2, AtSign, Camera, Save, CheckCircle2,
  AlertCircle, Loader2, ArrowLeft, Sparkles, X, Plus,
} from "lucide-react";

/* ── types ── */
interface ProfileData {
  displayName: string;
  bio: string;
  college: string;
  course: string;
  graduationYear: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  skills: string[];
  avatarUrl: string;
  avatarPublicId: string;
}

const EMPTY: ProfileData = {
  displayName: "", bio: "", college: "", course: "",
  graduationYear: "", githubUrl: "", linkedinUrl: "",
  twitterUrl: "", skills: [], avatarUrl: "", avatarPublicId: "",
};

const GRAD_YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i - 2));

const SKILL_SUGGESTIONS = [
  "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js",
  "Java", "C++", "Rust", "Go", "SQL", "MongoDB", "PostgreSQL",
  "Machine Learning", "AI/LLMs", "DevOps", "Docker", "Kubernetes",
  "AWS", "GCP", "UI/UX Design", "Figma", "Cybersecurity", "Blockchain",
];

/* ── helpers ── */
function InputField({
  label, icon: Icon, value, onChange, placeholder, type = "text", disabled = false,
}: {
  label: string; icon: React.ElementType; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

/* ── page ── */
export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── redirect if not signed in ── */
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin?callbackUrl=/profile");
  }, [status, router]);

  /* ── fetch profile ── */
  useEffect(() => {
    if (status !== "authenticated") return;
    (async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.success && data.profile) {
          setProfile({
            displayName: data.profile.displayName ?? session?.user?.name ?? "",
            bio: data.profile.bio ?? "",
            college: data.profile.college ?? "",
            course: data.profile.course ?? "",
            graduationYear: data.profile.graduationYear ?? "",
            githubUrl: data.profile.githubUrl ?? "",
            linkedinUrl: data.profile.linkedinUrl ?? "",
            twitterUrl: data.profile.twitterUrl ?? "",
            skills: data.profile.skills ?? [],
            avatarUrl: data.profile.avatarUrl ?? "",
            avatarPublicId: data.profile.avatarPublicId ?? "",
          });
        } else {
          // First time — seed from OAuth session
          setProfile((p) => ({ ...p, displayName: session?.user?.name ?? "" }));
        }
      } catch {
        setProfile((p) => ({ ...p, displayName: session?.user?.name ?? "" }));
      } finally {
        setLoading(false);
      }
    })();
  }, [status, session]);

  /* ── avatar upload ── */
  const handleAvatarChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Avatar must be under 5 MB"); return; }

    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "nexhack/avatars");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Upload failed");
      setProfile((p) => ({
        ...p,
        avatarUrl: data.url,
        avatarPublicId: data.publicId,
      }));
    } catch (err: any) {
      setError(err.message ?? "Avatar upload failed");
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  }, []);

  /* ── skills ── */
  const addSkill = useCallback((skill: string) => {
    const s = skill.trim();
    if (!s || profile.skills.includes(s) || profile.skills.length >= 15) return;
    setProfile((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput("");
  }, [profile.skills]);

  const removeSkill = useCallback((skill: string) => {
    setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  }, []);

  /* ── save ── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          oldAvatarPublicId: profile.avatarPublicId !== (await fetch("/api/user/profile").then(r => r.json()).then(d => d.profile?.avatarPublicId ?? "")) ? profile.avatarPublicId : undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // Refresh the session image if avatar changed
      if (profile.avatarUrl) await updateSession();
    } catch (err: any) {
      setError(err.message ?? "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  /* ── current avatar to display ── */
  const displayAvatar = avatarPreview || profile.avatarUrl || session?.user?.image || null;
  const initials = (profile.displayName || session?.user?.name || "U")[0].toUpperCase();

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col selection:bg-blue-600 selection:text-white">
        <Navbar onJoinClick={() => setIsJoinOpen(true)} />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Loading your profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />

      <main className="flex-1 pt-20 sm:pt-24 pb-16">
        {/* ── Page hero ── */}
        <section className="relative py-10 sm:py-14 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80 bg-tech-grid overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <div className="flex items-center gap-3 mb-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Your Profile
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Edit Profile</h1>
            <p className="text-sm text-slate-500 mt-1">Your public identity on NEXHACK. Visible to teammates and event organisers.</p>
          </div>
        </section>

        {/* ── Form ── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
          <form onSubmit={handleSave} className="space-y-8">

            {/* Error / success banners */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {saved && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Profile saved successfully!</span>
              </div>
            )}

            {/* ── Avatar card ── */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200">
              <h2 className="text-sm font-black text-slate-900 mb-5 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" /> Profile Photo
              </h2>
              <div className="flex items-center gap-6">
                {/* Avatar preview */}
                <div className="relative shrink-0">
                  {displayAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={displayAvatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg ring-2 ring-blue-500/20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white shadow-lg ring-2 ring-blue-500/20 flex items-center justify-center text-white font-black text-2xl">
                      {initials}
                    </div>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 rounded-2xl bg-white/80 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload a photo or your OAuth avatar is used automatically.<br />
                    JPG, PNG, WebP · max 5 MB.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    {uploadingAvatar ? "Uploading…" : "Change Photo"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
            </div>

            {/* ── Basic info card ── */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Basic Info
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="Display Name"
                  icon={User}
                  value={profile.displayName}
                  onChange={(v) => setProfile((p) => ({ ...p, displayName: v }))}
                  placeholder="How you appear on NEXHACK"
                />
                <InputField
                  label="Email"
                  icon={Mail}
                  value={session?.user?.email ?? ""}
                  onChange={() => {}}
                  disabled
                  placeholder="From your OAuth account"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell the community a bit about yourself — your interests, what you build, what you're looking for…"
                  rows={3}
                  maxLength={280}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
                <p className="text-[10px] text-slate-400 text-right">{profile.bio.length}/280</p>
              </div>
            </div>

            {/* ── Education card ── */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-violet-600" /> Education
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="College / School"
                  icon={Building2}
                  value={profile.college}
                  onChange={(v) => setProfile((p) => ({ ...p, college: v }))}
                  placeholder="e.g. IIT Bombay, Delhi Public School"
                />
                <InputField
                  label="Course / Grade"
                  icon={BookOpen}
                  value={profile.course}
                  onChange={(v) => setProfile((p) => ({ ...p, course: v }))}
                  placeholder="e.g. B.Tech CSE, Grade 12"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Graduation Year</label>
                <select
                  value={profile.graduationYear}
                  onChange={(e) => setProfile((p) => ({ ...p, graduationYear: e.target.value }))}
                  className="w-full sm:w-48 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="">Select year</option>
                  {GRAD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* ── Skills card ── */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" /> Skills
                <span className="ml-auto text-[10px] font-semibold text-slate-400">{profile.skills.length}/15</span>
              </h2>

              {/* Added skills */}
              {profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-rose-500 transition-colors cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  disabled={!skillInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quick add</p>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_SUGGESTIONS.filter((s) => !profile.skills.includes(s)).slice(0, 12).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Social links card ── */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <GitFork className="w-4 h-4 text-slate-700" /> Social Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="GitHub"
                  icon={GitFork}
                  value={profile.githubUrl}
                  onChange={(v) => setProfile((p) => ({ ...p, githubUrl: v }))}
                  placeholder="https://github.com/username"
                  type="url"
                />
                <InputField
                  label="LinkedIn"
                  icon={Link2}
                  value={profile.linkedinUrl}
                  onChange={(v) => setProfile((p) => ({ ...p, linkedinUrl: v }))}
                  placeholder="https://linkedin.com/in/username"
                  type="url"
                />
                <InputField
                  label="Twitter / X"
                  icon={AtSign}
                  value={profile.twitterUrl}
                  onChange={(v) => setProfile((p) => ({ ...p, twitterUrl: v }))}
                  placeholder="https://x.com/username"
                  type="url"
                />
              </div>
            </div>

            {/* ── Save button ── */}
            <div className="flex items-center justify-between pb-4">
              <Link
                href="/team"
                className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Go to My Team →
              </Link>
              <button
                type="submit"
                disabled={saving || uploadingAvatar}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.99] disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                ) : saved ? (
                  <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Profile</>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer onOpenLegal={(type) => setLegalModalType(type)} onJoinClick={() => setIsJoinOpen(true)} />
      <JoinCommunityModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <LegalModal isOpen={!!legalModalType} onClose={() => setLegalModalType(null)} type={legalModalType || "privacy"} />
    </div>
  );
}
