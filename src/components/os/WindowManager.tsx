"use client";

import { useOSStore } from "@/lib/store";
import { Window } from "./Window";

import { AIExamPrep } from "../apps/AIExamPrep";
import { MindMap } from "../apps/MindMap";
import { ClassRoutine } from "../apps/ClassRoutine";
import { Notices } from "../apps/Notices";
import { StudyBuddy } from "../apps/StudyBuddy";

export function WindowManager() {
  const { windows } = useOSStore();

  return (
    // The area between the menu bar (28px) and the dock bottom offset
    <div className="absolute top-[28px] left-0 right-0 bottom-[88px] overflow-hidden">
      {windows.map((w) => {
        if (!w.isOpen && !w.isMinimized) return null;

        return (
          <Window key={w.id} windowState={w}>
            {w.appId === 'ai-exam-prep' ? (
              <AIExamPrep />
            ) : w.appId === 'mind-map' ? (
              <MindMap />
            ) : w.appId === 'study-buddy' ? (
              <StudyBuddy />
            ) : w.appId === 'class-routine' ? (
              <ClassRoutine />
            ) : w.appId === 'notices' ? (
              <Notices />
            ) : (
              <div className="p-8 text-graphite h-full flex flex-col items-center justify-center">
                <h2 className="text-2xl font-semibold mb-2">{w.title}</h2>
                <p className="text-gray-500">Coming soon...</p>
              </div>
            )}
          </Window>
        );
      })}
    </div>
  );
}
