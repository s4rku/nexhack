"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { SpeakerSession } from "@/data/nexhackData";
import { CheckCircle2, Calendar, Clock, Video, UserCheck, Sparkles } from "lucide-react";

interface SessionRsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SpeakerSession | null;
}

export const SessionRsvpModal: React.FC<SessionRsvpModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRsvpd, setIsRsvpd] = useState(false);

  if (!session) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRsvpd(true);
  };

  const handleReset = () => {
    setIsRsvpd(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={isRsvpd ? "Seat Reserved!" : "RSVP for Knowledge Session"}
      subtitle={session.title}
      maxWidth="md"
    >
      {isRsvpd ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">You are on the Guest List!</h4>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              We&apos;ve sent the private stream link and Google Calendar invite to{" "}
              <strong className="text-slate-900">{email}</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>{session.time} ({session.duration})</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Video className="w-3.5 h-3.5 text-cyan-600" />
              <span>Format: {session.mode} (Live Q&A enabled)</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <img
              src={session.speaker.avatar}
              alt={session.speaker.name}
              className="w-12 h-12 rounded-full object-cover border border-white shadow-xs"
            />
            <div>
              <div className="text-sm font-bold text-slate-900">{session.speaker.name}</div>
              <div className="text-xs text-slate-500">
                {session.speaker.role} at {session.speaker.company}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
            <div>
              <strong>Date:</strong> {session.date}
            </div>
            <div>
              <strong>Time:</strong> {session.time}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Siddharth Rao"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Reserve Free Pass ({session.seatsLeft} spots remaining)
          </button>
        </form>
      )}
    </Modal>
  );
};
