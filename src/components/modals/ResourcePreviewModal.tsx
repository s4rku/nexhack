"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { ResourceItem } from "@/data/nexhackData";
import { Clock, Calendar, CheckSquare, BookOpen, Share2 } from "lucide-react";

interface ResourcePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: ResourceItem | null;
}

export const ResourcePreviewModal: React.FC<ResourcePreviewModalProps> = ({
  isOpen,
  onClose,
  resource,
}) => {
  if (!resource) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resource.category}
      subtitle={`By ${resource.author} • ${resource.readTime}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {resource.title}
          </h3>
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              {resource.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              {resource.readTime}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          {resource.excerpt}
        </p>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            Key Frameworks & Action Steps
          </h4>
          <div className="space-y-2">
            {resource.contentSummary.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/40 border border-blue-100 text-xs text-slate-800"
              >
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
          >
            Close Reader
          </button>
        </div>
      </div>
    </Modal>
  );
};
