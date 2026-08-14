"use client";

import { useOSStore } from "@/lib/store";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginScreen() {
  const { login } = useOSStore();
  const [roll, setRoll] = useState("");
  const [reg, setReg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll || !reg) return;
    setIsLoading(true);
    await login(roll, reg);
    // Component will unmount via Desktop's AnimatePresence
  };

  return (
    <div className="w-full h-full bg-ink-navy flex flex-col items-center justify-center relative">
      {/* Background static pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-circuit-teal) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-circuit-teal) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="w-[420px] bg-cloud-white rounded-xl shadow-raised border border-border-light p-12 flex flex-col items-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-signal-blue flex items-center justify-center mb-6">
          <span className="text-cloud-white font-bold text-2xl">R</span>
        </div>
        
        <h1 className="text-display-xl text-graphite mb-8 tracking-tight">
          RUET OS
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-caption text-graphite">Roll Number</label>
            <input 
              type="text"
              required
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              placeholder="e.g. 1903001"
              className="w-full h-[44px] rounded-md bg-cloud-white border border-border-light px-3 text-mono-md text-graphite placeholder:text-[#9AA3B2] focus:outline-none focus:border-[1.5px] focus:border-signal-blue focus:ring-[3px] focus:ring-focus-ring transition-shadow"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-caption text-graphite">Registration Number</label>
            <input 
              type="password"
              required
              value={reg}
              onChange={(e) => setReg(e.target.value)}
              placeholder="••••••••"
              className="w-full h-[44px] rounded-md bg-cloud-white border border-border-light px-3 text-mono-md text-graphite placeholder:text-[#9AA3B2] focus:outline-none focus:border-[1.5px] focus:border-signal-blue focus:ring-[3px] focus:ring-focus-ring transition-shadow"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[44px] mt-4 bg-signal-blue text-cloud-white text-body-md font-medium rounded-md hover:bg-signal-blue-dark active:translate-y-[1px] transition-all duration-120 flex items-center justify-center gap-2 disabled:opacity-80 disabled:active:translate-y-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Unlocking…</span>
              </>
            ) : (
              "Unlock"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
