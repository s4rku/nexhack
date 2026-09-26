"use client";

import React, { useEffect, useState, useRef } from "react";
import { COMMUNITY_STATS, StatItem } from "@/data/nexhackData";
import { Users, GraduationCap, MapPin, Trophy, Rocket } from "lucide-react";

export const StatsSection: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Users":
        return <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />;
      case "MapPin":
        return <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />;
      case "Trophy":
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />;
      case "Rocket":
        return <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />;
      default:
        return <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-8 sm:py-12 border-y border-slate-200/80 bg-slate-50/50"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-6">
          {COMMUNITY_STATS.map((stat, idx) => (
            <CounterCard
              key={stat.id}
              stat={stat}
              startAnimation={hasAnimated}
              delay={idx * 100}
              icon={getIcon(stat.iconName)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CounterCardProps {
  stat: StatItem;
  startAnimation: boolean;
  delay: number;
  icon: React.ReactNode;
}

const CounterCard: React.FC<CounterCardProps> = ({
  stat,
  startAnimation,
  delay,
  icon,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let start = 0;
    const end = stat.value;
    const duration = 1200;
    const startTime = performance.now();

    const timer = setTimeout(() => {
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(easeProgress * (end - start) + start);

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timer);
  }, [startAnimation, stat.value, delay]);

  return (
    <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 group-hover:bg-blue-50/50 transition-all shrink-0">
          {icon}
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          TARGET
        </span>
      </div>

      <div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
            {count}
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {stat.suffix}
          </span>
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 sm:mt-1 leading-snug">
          {stat.label}
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{stat.sublabel}</p>
      </div>
    </div>
  );
};
