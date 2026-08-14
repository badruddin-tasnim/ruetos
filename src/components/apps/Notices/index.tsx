"use client";

import { useState } from "react";
import { Bell, Search, Filter, Calendar, FileText, Download, Share2, ChevronRight, CheckCircle2, AlertTriangle, Info, Clock, Pin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock notices data
const noticesData = [
  {
    id: 1,
    title: "Registration for Fall 2026 Semester",
    category: "Academic",
    date: "14 Aug 2026",
    issuer: "Registrar Office",
    priority: "high",
    isPinned: true,
    content: "All students are hereby notified that the course registration for the Fall 2026 semester will commence from 20th August 2026. Students must clear all previous dues before registering. Late registration will incur a penalty of BDT 500.",
    attachments: [{ name: "Registration_Guidelines_Fall26.pdf", size: "245 KB" }]
  },
  {
    id: 2,
    title: "Revised Schedule for Mid-Term Exams",
    category: "Exam",
    date: "12 Aug 2026",
    issuer: "Controller of Examinations",
    priority: "medium",
    isPinned: true,
    content: "Due to unavoidable circumstances, the mid-term examinations for 3rd and 4th-year students scheduled for next week have been postponed. The revised routine is attached to this notice. Please contact your respective department heads for further clarification.",
    attachments: [{ name: "Revised_MidTerm_Routine.pdf", size: "1.2 MB" }]
  },
  {
    id: 3,
    title: "Call for Papers: RUET Tech Fest 2026",
    category: "Events",
    date: "10 Aug 2026",
    issuer: "Director, Student Welfare",
    priority: "low",
    isPinned: false,
    content: "The annual RUET Tech Fest is back! We are inviting paper submissions and project proposals from all undergraduate students. Exceptional projects will receive funding and mentorship from our alumni network.",
    attachments: [{ name: "TechFest_CallForPapers.pdf", size: "890 KB" }]
  },
  {
    id: 4,
    title: "Maintenance Shutdown of Central Server",
    category: "Administrative",
    date: "08 Aug 2026",
    issuer: "IT Cell",
    priority: "low",
    isPinned: false,
    content: "The university's central server will undergo scheduled maintenance on Friday, 16th August 2026, from 12:00 AM to 06:00 AM. Access to the student portal, library management system, and institutional email will be temporarily unavailable during this window.",
    attachments: []
  },
  {
    id: 5,
    title: "Notice regarding Library Book Returns",
    category: "Academic",
    date: "05 Aug 2026",
    issuer: "Central Library",
    priority: "medium",
    isPinned: false,
    content: "Students who have borrowed books from the Central Library for the Spring semester must return them by 15th August 2026. Failure to return the books on time will result in a suspension of borrowing privileges for the upcoming semester.",
    attachments: []
  }
];

const categories = ["All", "Academic", "Exam", "Events", "Administrative"];

export function Notices() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<any>(noticesData[0]);

  const filteredNotices = noticesData.filter(notice => {
    const matchesCategory = activeCategory === "All" || notice.category === activeCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full w-full bg-[#1c1c1e]">
      
      {/* Sidebar - Notice List */}
      <div className="w-[340px] flex-shrink-0 border-r border-black/[0.06] bg-[#1c1c1e]/80 backdrop-blur-xl flex flex-col h-full relative z-10">
        <div className="h-[60px] flex items-center px-5 shrink-0 sticky top-0 bg-[#1c1c1e]/95 backdrop-blur-md pt-2 border-b border-white/5 z-20">
          <div className="flex items-center gap-2.5 text-white/90 font-semibold text-[16px] tracking-tight w-full">
            <div className="w-7 h-7 rounded-md bg-rose-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <Bell size={14} />
            </div>
            <span>Notices</span>
          </div>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search notices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 rounded-[10px] bg-[#252525] border border-black/[0.05] shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide hide-scrollbar" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all border ${
                  activeCategory === cat 
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-sm' 
                  : 'bg-[#252525] text-white/70 border-white/10 hover:bg-[#1e1e1e]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="flex flex-col gap-1.5">
            {filteredNotices.map((notice) => (
              <button
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className={`w-full text-left p-3.5 rounded-[12px] transition-all relative overflow-hidden group ${
                  selectedNotice?.id === notice.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-transparent hover:bg-black/[0.03] text-white/90'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <span className={`text-[11px] font-bold tracking-wider uppercase ${selectedNotice?.id === notice.id ? 'text-blue-100' : 'text-white/60'}`}>
                    {notice.category}
                  </span>
                  <div className="flex gap-1.5 items-center">
                    {notice.isPinned && <Pin size={12} className={selectedNotice?.id === notice.id ? 'text-blue-100' : 'text-blue-500'} />}
                    <span className={`text-[11px] font-medium ${selectedNotice?.id === notice.id ? 'text-blue-100' : 'text-gray-500'}`}>
                      {notice.date}
                    </span>
                  </div>
                </div>
                
                <h4 className={`text-[14px] font-semibold leading-tight mb-2 ${selectedNotice?.id === notice.id ? 'text-white' : 'text-white/90'}`}>
                  {notice.title}
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className={`text-[12px] font-medium line-clamp-1 ${selectedNotice?.id === notice.id ? 'text-blue-100' : 'text-white/70'}`}>
                    {notice.issuer}
                  </span>
                  {notice.attachments.length > 0 && (
                    <FileText size={12} className={selectedNotice?.id === notice.id ? 'text-blue-200' : 'text-gray-500'} />
                  )}
                </div>
              </button>
            ))}
            
            {filteredNotices.length === 0 && (
              <div className="text-center py-10 px-4">
                <p className="text-white/60 text-[13px] font-medium">No notices found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Reading Pane */}
      <div className="flex-1 bg-[#252525] flex flex-col h-full relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedNotice ? (
            <motion.div 
              key={selectedNotice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-10 max-w-[800px] mx-auto w-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider ${
                  selectedNotice.priority === 'high' ? 'bg-red-500/10 text-red-400' : 
                  selectedNotice.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' : 
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {selectedNotice.priority} Priority
                </span>
                <span className="text-white/60 text-[13px] font-medium flex items-center gap-1.5">
                  <Calendar size={14} /> {selectedNotice.date}
                </span>
                {selectedNotice.isPinned && (
                  <span className="text-blue-500 text-[13px] font-medium flex items-center gap-1.5">
                    <Pin size={14} /> Pinned
                  </span>
                )}
              </div>

              <h1 className="text-[32px] font-semibold text-white/90 tracking-tight leading-tight mb-4">
                {selectedNotice.title}
              </h1>

              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-500 border border-white/10">
                    <Info size={20} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white/90">{selectedNotice.issuer}</p>
                    <p className="text-[13px] text-white/60">Official Notification</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center text-gray-600 hover:bg-[#2a2a2a] hover:text-white/90 transition-colors border border-white/10 shadow-sm">
                    <Share2 size={16} />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-[#1e1e1e] flex items-center justify-center text-gray-600 hover:bg-[#2a2a2a] hover:text-white/90 transition-colors border border-white/10 shadow-sm">
                    <Download size={16} />
                  </button>
                </div>
              </div>

              <div className="prose prose-blue max-w-none mb-12">
                <p className="text-[16px] text-white/80 leading-relaxed whitespace-pre-line">
                  {selectedNotice.content}
                </p>
              </div>

              {selectedNotice.attachments.length > 0 && (
                <div>
                  <h3 className="text-[14px] font-semibold text-white/90 mb-4 uppercase tracking-wider">Attachments</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedNotice.attachments.map((file: any, idx: number) => (
                      <div key={idx} className="bg-[#1e1e1e] rounded-[16px] p-4 border border-white/10 flex items-center gap-4 hover:border-blue-300 hover:bg-blue-500/10/50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                          <FileText size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-white/90 truncate mb-0.5 group-hover:text-blue-600 transition-colors">{file.name}</p>
                          <p className="text-[12px] text-white/60">{file.size} • PDF Document</p>
                        </div>
                        <Download size={18} className="text-gray-500 group-hover:text-blue-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 bg-[#1e1e1e] rounded-full flex items-center justify-center text-gray-300 mb-6">
                <Bell size={32} />
              </div>
              <h2 className="text-[20px] font-semibold text-white/90 mb-2">Select a Notice</h2>
              <p className="text-white/60 text-[14px] max-w-[280px]">Choose a notice from the sidebar to read its full contents and download attachments.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
