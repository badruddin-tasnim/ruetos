"use client";

import { useEffect, useState } from "react";
import { useOSStore } from "@/lib/store";
import { Wifi, Battery, Search } from "lucide-react";

export function MenuBar() {
  const { studentName, studentRoll, activeAppId, windows } = useOSStore();
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeWindow = windows.find((w) => w.appId === activeAppId && w.isOpen);
  const appName = activeWindow?.title || "RUET OS";

  return (
    <div className="fixed top-0 w-full h-[28px] bg-black/30 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-3 text-[13px] text-white/90 z-[9999] select-none">
      {/* Left: App name only */}
      <div className="flex items-center gap-4">
        <span className="font-semibold tracking-tight">{appName}</span>
      </div>

      {/* Right: system tray */}
      <div className="flex items-center gap-3">
        <span className="opacity-70 text-[12px]">{studentName} · {studentRoll}</span>
        <div className="flex items-center gap-2 opacity-80">
          <Search size={13} strokeWidth={2} />
          <Wifi size={14} strokeWidth={2} />
          <Battery size={14} strokeWidth={2} />
        </div>
        <div className="flex items-center gap-1 text-[12px]">
          <span className="opacity-70">{date}</span>
          <span className="font-medium">{time}</span>
        </div>
      </div>
    </div>
  );
}
