"use client";

import { useState } from "react";
import { CalendarDays, Clock, MapPin, Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

// Mock data for a typical CSE routine (Sunday to Thursday)
const routineData = [
  {
    day: "Sunday",
    date: "10 Aug",
    classes: [
      { id: 1, course: "CSE 320", type: "Theory", title: "Operating Systems", time: "08:00 AM - 08:50 AM", room: "Room 401", color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-700" },
      { id: 2, course: "CSE 322", type: "Theory", title: "Computer Architecture", time: "08:50 AM - 09:40 AM", room: "Room 401", color: "bg-purple-500", lightColor: "bg-purple-50", textColor: "text-purple-700" },
      { id: 3, course: "MATH 301", type: "Theory", title: "Engineering Mathematics", time: "10:00 AM - 10:50 AM", room: "Room 305", color: "bg-emerald-500", lightColor: "bg-emerald-50", textColor: "text-emerald-700" },
      { id: 4, course: "CSE 324", type: "Lab", title: "System Analysis Lab", time: "11:40 AM - 02:10 PM", room: "Software Lab", color: "bg-amber-500", lightColor: "bg-amber-50", textColor: "text-amber-700" },
    ]
  },
  {
    day: "Monday",
    date: "11 Aug",
    classes: [
      { id: 5, course: "HUM 303", type: "Theory", title: "Economics", time: "08:00 AM - 08:50 AM", room: "Room 402", color: "bg-rose-500", lightColor: "bg-rose-50", textColor: "text-rose-700" },
      { id: 6, course: "CSE 326", type: "Theory", title: "Database Systems", time: "08:50 AM - 09:40 AM", room: "Room 401", color: "bg-indigo-500", lightColor: "bg-indigo-50", textColor: "text-indigo-700" },
      { id: 7, course: "CSE 320", type: "Theory", title: "Operating Systems", time: "10:00 AM - 10:50 AM", room: "Room 401", color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-700" },
    ]
  },
  {
    day: "Tuesday",
    date: "12 Aug",
    classes: [
      { id: 8, course: "CSE 326", type: "Lab", title: "Database Systems Lab", time: "08:00 AM - 10:30 AM", room: "Network Lab", color: "bg-indigo-500", lightColor: "bg-indigo-50", textColor: "text-indigo-700" },
      { id: 9, course: "CSE 322", type: "Theory", title: "Computer Architecture", time: "10:50 AM - 11:40 AM", room: "Room 401", color: "bg-purple-500", lightColor: "bg-purple-50", textColor: "text-purple-700" },
    ]
  },
  {
    day: "Wednesday",
    date: "13 Aug",
    classes: [
      { id: 10, course: "MATH 301", type: "Theory", title: "Engineering Mathematics", time: "08:00 AM - 08:50 AM", room: "Room 305", color: "bg-emerald-500", lightColor: "bg-emerald-50", textColor: "text-emerald-700" },
      { id: 11, course: "CSE 320", type: "Lab", title: "Operating Systems Lab", time: "08:50 AM - 11:20 AM", room: "Hardware Lab", color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-700" },
      { id: 12, course: "HUM 303", type: "Theory", title: "Economics", time: "11:40 AM - 12:30 PM", room: "Room 402", color: "bg-rose-500", lightColor: "bg-rose-50", textColor: "text-rose-700" },
    ]
  },
  {
    day: "Thursday",
    date: "14 Aug",
    classes: [
      { id: 13, course: "CSE 324", type: "Theory", title: "System Analysis", time: "08:50 AM - 09:40 AM", room: "Room 401", color: "bg-amber-500", lightColor: "bg-amber-50", textColor: "text-amber-700" },
      { id: 14, course: "CSE 326", type: "Theory", title: "Database Systems", time: "10:00 AM - 10:50 AM", room: "Room 401", color: "bg-indigo-500", lightColor: "bg-indigo-50", textColor: "text-indigo-700" },
      { id: 15, course: "CSE 322", type: "Lab", title: "Computer Architecture Lab", time: "11:40 AM - 02:10 PM", room: "Hardware Lab", color: "bg-purple-500", lightColor: "bg-purple-50", textColor: "text-purple-700" },
    ]
  }
];

export function ClassRoutine() {
  const [activeTab, setActiveTab] = useState<'week' | 'today'>('week');
  
  return (
    <div className="flex flex-col h-full w-full bg-[#f5f5f7]">
      {/* App Header */}
      <div className="h-[60px] flex items-center justify-between px-8 shrink-0 bg-[#f5f5f7] sticky top-0 z-10 pt-2 border-b border-black/[0.04]">
        <div className="flex items-center gap-3 text-[#1d1d1f] font-semibold text-[18px] tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm">
            <CalendarDays size={18} />
          </div>
          <span>Class Routine</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-gray-200/60 p-1 rounded-full flex items-center">
            <button 
              onClick={() => setActiveTab('week')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${activeTab === 'week' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setActiveTab('today')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${activeTab === 'today' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            >
              Today
            </button>
          </div>
          
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-8 pr-4 py-1.5 rounded-full bg-white border border-gray-200 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-48 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-black/[0.02]">
            <div className="flex flex-col">
              <h2 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight">Fall 2026 — 5th Semester</h2>
              <p className="text-[#86868b] text-[14px] font-medium">CSE Department • Section A</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span className="text-[14px] font-medium text-[#1d1d1f] w-32 text-center">Aug 10 - Aug 14</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Routine Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {routineData.map((day, idx) => {
              if (activeTab === 'today' && day.day !== 'Wednesday') return null; // Mock today as Wednesday

              return (
                <motion.div 
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col gap-4"
                >
                  <div className={`p-4 rounded-[16px] shadow-sm border border-black/[0.03] flex items-center justify-between ${day.day === 'Wednesday' && activeTab === 'week' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                    <div>
                      <h3 className={`font-semibold tracking-tight ${day.day === 'Wednesday' && activeTab === 'week' ? 'text-blue-700' : 'text-[#1d1d1f]'}`}>{day.day}</h3>
                      <p className={`text-[13px] font-medium ${day.day === 'Wednesday' && activeTab === 'week' ? 'text-blue-500' : 'text-[#86868b]'}`}>{day.date}</p>
                    </div>
                    {day.day === 'Wednesday' && activeTab === 'week' && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {day.classes.length === 0 ? (
                      <div className="h-24 rounded-[16px] border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-[13px] font-medium bg-gray-50/50">
                        No Classes
                      </div>
                    ) : (
                      day.classes.map((cls) => (
                        <div key={cls.id} className={`${cls.lightColor} border border-white/60 p-4 rounded-[16px] flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer`}>
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${cls.color}`} />
                          
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex-shrink-0 ${cls.textColor} bg-white/60 backdrop-blur-sm shadow-sm`}>
                              {cls.type}
                            </span>
                            <span className={`text-[12px] font-bold ${cls.textColor}`}>{cls.course}</span>
                          </div>
                          
                          <div>
                            <h4 className="text-[#1d1d1f] font-semibold text-[15px] leading-snug mb-1">{cls.title}</h4>
                            <div className="flex flex-col gap-1.5 mt-2">
                              <div className="flex items-center gap-1.5 text-[#515154] text-[12px] font-medium">
                                <Clock size={12} className="opacity-70" /> {cls.time}
                              </div>
                              <div className="flex items-center gap-1.5 text-[#515154] text-[12px] font-medium">
                                <MapPin size={12} className="opacity-70" /> {cls.room}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
