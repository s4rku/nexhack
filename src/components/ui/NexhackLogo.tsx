import React from "react";

interface NexhackLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  inverted?: boolean;
  className?: string;
  variant?: "icon-and-text" | "full-badge" | "icon-only" | "horizontal";
}

export const NexhackLogo: React.FC<NexhackLogoProps> = ({
  size = "md",
  showTagline = true,
  inverted = false,
  className = "",
  variant = "icon-and-text",
}) => {
  const sizeMap = {
    sm: { img: 32, height: 32, text: "text-base tracking-wider", sub: "text-[8px]" },
    md: { img: 40, height: 38, text: "text-lg sm:text-xl tracking-wider", sub: "text-[9px]" },
    lg: { img: 50, height: 46, text: "text-2xl sm:text-3xl tracking-wide", sub: "text-[10px]" },
    xl: { img: 64, height: 56, text: "text-3xl sm:text-4xl tracking-wide", sub: "text-xs" },
  };

  const currentSize = sizeMap[size];

  // Variant 1: Complete Full Square Badge
  if (variant === "full-badge") {
    return (
      <div className={`inline-flex items-center group ${className}`}>
        <div
          className="rounded-2xl bg-black border border-blue-500/40 shadow-lg shadow-blue-500/20 p-1 flex items-center justify-center transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-cyan-500/30 overflow-hidden"
          style={{ width: currentSize.img * 2.2, height: currentSize.img * 2.2 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-full.png"
            alt="NEXHACK"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  }

  // Variant 2: Horizontal Official Lockup (Glowing Emblem + Stylized NEXHACK Typography)
  if (variant === "horizontal") {
    return (
      <div className={`inline-flex items-center group ${className}`}>
        <div
          className={`rounded-xl bg-black border border-blue-500/35 shadow-md shadow-blue-500/20 px-2 py-1 flex items-center justify-center transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-cyan-400/30 ${
            inverted ? "bg-black/90" : "bg-black"
          }`}
          style={{ height: currentSize.height }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-horizontal.png"
            alt="NEXHACK"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  // Variant 3: Default Icon + Clean Typography
  return (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Official Glowing Geometric Emblem (100% Uncut with Safe Margins) */}
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
        <div
          className="rounded-xl sm:rounded-2xl bg-black border border-blue-500/40 shadow-md shadow-blue-500/20 p-1 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-cyan-400/30 transition-all overflow-hidden"
          style={{ width: currentSize.img, height: currentSize.img }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-icon.png"
            alt="NEXHACK Emblem"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Brand Typography */}
      {variant !== "icon-only" && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black uppercase tracking-wider ${
                inverted
                  ? "text-white group-hover:text-cyan-400"
                  : "text-slate-900 group-hover:text-blue-600"
              } ${currentSize.text} transition-colors`}
              style={{
                letterSpacing: "0.07em",
              }}
            >
              NEXHACK
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-xs shadow-cyan-400" />
          </div>
          {showTagline && (
            <span
              className={`font-bold tracking-widest uppercase mt-0.5 ${
                inverted ? "text-slate-400" : "text-slate-500"
              } ${currentSize.sub}`}
            >
              Build • Hack • Learn
            </span>
          )}
        </div>
      )}
    </div>
  );
};
