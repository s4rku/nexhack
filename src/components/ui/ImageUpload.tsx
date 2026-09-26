"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value = "",
  onChange,
  folder = "nexhack",
  label = "Upload Image (Cloudinary)",
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size exceeds 10MB limit.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image to Cloudinary.");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-slate-300">{label}</label>}

      {value ? (
        <div className="relative group rounded-2xl border border-slate-700 bg-slate-900/60 p-3 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
            <Image
              src={value}
              alt="Uploaded Preview"
              fill
              className="object-cover"
              unoptimized={value.startsWith("data:")}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Uploaded to Cloudinary</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5" title={value}>
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-600"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              <p className="text-xs text-slate-300 font-semibold">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Click or drag & drop to upload image
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WEBP, SVG up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
