"use client";

import { useOSStore, AppId } from "@/lib/store";
import { Brain, Network, Users, Calendar, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const DOCK_APPS = [
  { id: "ai-exam-prep", title: "AI Exam Prep", icon: Brain, color: "#3B82F6" },
  { id: "mind-map", title: "Course Mind Map", icon: Network, color: "#0FAD86" },
  { id: "study-buddy", title: "Study Buddy", icon: Users, color: "#D94536" },
  { id: "class-routine", title: "Class Routine", icon: Calendar, color: "#64748B" },
  { id: "notices", title: "Notices", icon: Bell, color: "#F59E0B" },
] as const;

export function Dock() {
  const { windows, openWindow } = useOSStore();
  const [bouncingApp, setBouncingApp] = useState<string | null>(null);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const handleAppClick = (appId: AppId, title: string) => {
    setBouncingApp(appId);
    setTimeout(() => {
      setBouncingApp(null);
      openWindow(appId, title);
    }, 280);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="flex items-end gap-2 px-4 py-2 bg-[#252525]/20 dark:bg-[#252525]/10 backdrop-blur-2xl rounded-2xl border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {DOCK_APPS.map((app) => {
          const isOpen = windows.some((w) => w.appId === app.id && w.isOpen);
          const Icon = app.icon;
          const isBouncing = bouncingApp === app.id;
          const isHovered = hoveredApp === app.id;

          return (
            <div
              key={app.id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 4 }}
                transition={{ duration: 0.12 }}
                className="absolute -top-9 pointer-events-none"
              >
                <div className="bg-[rgba(30,30,30,0.85)] backdrop-blur-md text-white text-[12px] font-medium px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap">
                  {app.title}
                </div>
              </motion.div>

              {/* Icon */}
              <motion.button
                onClick={() => handleAppClick(app.id as AppId, app.title)}
                className="w-[54px] h-[54px] rounded-[14px] flex items-center justify-center text-white shadow-md border border-white/20 cursor-default"
                style={{ backgroundColor: app.color }}
                whileHover={{ scale: 1.18, y: -6 }}
                whileTap={{ scale: 0.95 }}
                animate={isBouncing ? { y: [-12, 0, -6, 0] } : { y: 0 }}
                transition={isBouncing ? { type: "keyframes", duration: 0.5 } : { type: "spring", stiffness: 400, damping: 22 }}
              >
                <Icon size={26} strokeWidth={1.5} />
              </motion.button>

              {/* Running indicator dot */}
              <div className="h-[5px] flex items-center justify-center mt-1">
                {isOpen && (
                  <div className="w-[4px] h-[4px] rounded-full bg-[#252525]/70" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
