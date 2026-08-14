"use client";

import { useOSStore, AppWindow } from "@/lib/store";
import { motion, useAnimationControls } from "framer-motion";
import { X, Minus } from "lucide-react";
import { useEffect, useState } from "react";

interface WindowProps {
  windowState: AppWindow;
  children: React.ReactNode;
}

export function Window({ windowState, children }: WindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, activeAppId } = useOSStore();
  const isFocused = activeAppId === windowState.appId;
  const controls = useAnimationControls();
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (windowState.isOpen && !windowState.isMinimized) {
      setIsAnimatingIn(true);
      controls.start({ opacity: 1, scale: 1, display: "flex" });
      setTimeout(() => setIsAnimatingIn(false), 300);
    } else if (windowState.isMinimized) {
      controls.start({ opacity: 0, scale: 0.9, y: 60, transitionEnd: { display: "none" } });
    } else if (!windowState.isOpen) {
      controls.start({ opacity: 0, scale: 0.98, transitionEnd: { display: "none" } });
    }
  }, [windowState.isOpen, windowState.isMinimized, controls]);

  if (!windowState.isOpen && !windowState.isMinimized) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={controls}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onPointerDown={() => focusWindow(windowState.id)}
      style={{ zIndex: windowState.zIndex }}
      className="absolute inset-0 flex flex-col bg-[#f5f5f5] overflow-hidden"
    >
      {/* macOS-style title bar */}
      <div
        className={`h-[38px] shrink-0 flex items-center px-4 relative border-b border-black/10 transition-colors ${
          isFocused
            ? "bg-[rgba(235,235,235,0.92)] backdrop-blur-xl"
            : "bg-[rgba(245,245,245,0.85)] backdrop-blur-xl"
        }`}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-[8px] absolute left-4">
          <button
            onClick={(e) => { e.stopPropagation(); closeWindow(windowState.id); }}
            className="w-[13px] h-[13px] rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center group hover:brightness-90 transition-all"
            title="Close"
          >
            <span className="text-[#7A0000] opacity-0 group-hover:opacity-100 text-[8px] font-bold leading-none">✕</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); minimizeWindow(windowState.id); }}
            className="w-[13px] h-[13px] rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center group hover:brightness-90 transition-all"
            title="Minimize"
          >
            <span className="text-[#7A4000] opacity-0 group-hover:opacity-100 text-[10px] font-bold leading-none">−</span>
          </button>
          {/* Green button just decorative — no un-fullscreen since apps are always fullscreen */}
          <div className="w-[13px] h-[13px] rounded-full bg-[#27C93F] border border-[#1AAB29] opacity-30 cursor-not-allowed" title="Full Screen (already)" />
        </div>

        {/* Window title centered */}
        <div className="flex-1 text-center text-[13px] font-semibold text-[#1a1a1a] tracking-tight select-none">
          {windowState.title}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative bg-[#f5f5f7]">
        {children}
      </div>
    </motion.div>
  );
}

// WindowManager renders all windows — each fills the full screen area
export function WindowManager() {
  return null; // Re-exported from WindowManager.tsx
}
