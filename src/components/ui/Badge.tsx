import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "purple" | "cyan" | "emerald" | "amber" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  dot = false,
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-semibold tracking-wide",
    md: "px-3 py-1 text-xs font-semibold tracking-wide",
    lg: "px-3.5 py-1.5 text-sm font-semibold tracking-wide",
  };

  const variantClasses = {
    primary: "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs",
    secondary: "bg-slate-100 text-slate-800 border border-slate-200 shadow-xs",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs",
    cyan: "bg-cyan-50 text-cyan-800 border border-cyan-200/80 shadow-xs",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs",
    amber: "bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs",
    outline: "bg-white/80 text-slate-700 border border-slate-300 shadow-xs backdrop-blur-xs",
  };

  const dotColors = {
    primary: "bg-blue-600",
    secondary: "bg-slate-500",
    purple: "bg-purple-600",
    cyan: "bg-cyan-600",
    emerald: "bg-emerald-500 animate-pulse",
    amber: "bg-amber-500 animate-pulse",
    outline: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
