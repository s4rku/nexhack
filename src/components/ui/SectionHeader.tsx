"use client";

import React from "react";
import { Badge } from "./Badge";

interface SectionHeaderProps {
  badgeText?: string;
  badgeVariant?: "primary" | "secondary" | "purple" | "cyan" | "emerald";
  title: string;
  highlightText?: string;
  highlightGradient?: "blue" | "purple" | "cyan";
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  badgeVariant = "primary",
  title,
  highlightText,
  highlightGradient = "blue",
  description,
  align = "center",
  className = "",
}) => {
  const gradientMap = {
    blue: "from-blue-600 via-indigo-600 to-cyan-500",
    purple: "from-violet-600 via-purple-600 to-indigo-500",
    cyan: "from-cyan-600 via-blue-600 to-indigo-600",
  };

  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {badgeText && (
        <div className={`mb-3.5 ${align === "center" ? "flex justify-center" : ""}`}>
          <Badge variant={badgeVariant} dot>
            {badgeText}
          </Badge>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
        {title}{" "}
        {highlightText && (
          <span
            className={`bg-gradient-to-r ${gradientMap[highlightGradient]} bg-clip-text text-transparent`}
          >
            {highlightText}
          </span>
        )}
      </h2>

      {description && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};
