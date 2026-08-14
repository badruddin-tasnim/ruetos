"use client";

import { useState, useEffect } from "react";
import { useOSStore } from "@/lib/store";
import { Loader2, ArrowLeft, BrainCircuit, CheckCircle2, ChevronRight, Target, Clock, AlertCircle, BookOpen, Plus, X, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ViewState = 'course-list' | 'dashboard' | 'practice' | 'study-plan';

export function AIExamPrep() {
  const { studentRoll } = useOSStore();
  const [view, setView] = useState<ViewState>('course-list');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  
  // Courses state
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [addingCourse, setAddingCourse] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await fetch('/api/data/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) return;
    
    setAddingCourse(true);
    setErrorMsg("");
    try {
      const res = await fetch('/api/data/courses', {
        method: 'POST',
        body: JSON.stringify({ code: newCode, title: newTitle })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create course");
      } else {
        setShowAddModal(false);
        setNewCode("");
        setNewTitle("");
        loadCourses();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred");
    } finally {
      setAddingCourse(false);
    }
  };

  const openCourseDashboard = (course: any) => {
    setSelectedCourse(course);
    setView('dashboard');
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setView('course-list');
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f5f5f7]">
      {/* App Header */}
      <div className="h-[60px] flex items-center justify-between px-8 shrink-0 bg-[#f5f5f7] sticky top-0 z-10 pt-2 border-b border-black/[0.04]">
        <div className="flex items-center gap-3 text-[#1d1d1f] font-semibold text-[18px] tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-sm">
            <BrainCircuit size={18} />
          </div>
          {view === 'course-list' && <span>AI Exam Prep</span>}
          {view === 'dashboard' && <span>{selectedCourse?.code} — Prep</span>}
          {view === 'practice' && <span>Practice: {selectedTopic?.name}</span>}
          {view === 'study-plan' && <span>Study Plan</span>}
        </div>
        
        {view !== 'course-list' && (
          <button 
            onClick={view === 'dashboard' ? handleBackToCourses : () => setView('dashboard')}
            className="flex items-center gap-1.5 text-[#0066cc] hover:text-[#004499] transition-colors bg-blue-50/50 px-3 py-1.5 rounded-full text-[13px] font-medium"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8 pt-4 pb-20 relative">
        <AnimatePresence mode="wait">
          {view === 'course-list' && (
            <motion.div key="course-list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <div className="max-w-[1000px] mx-auto pt-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">Select Course to Prep</h2>
                    <p className="text-[#86868b] text-[15px] font-medium mt-1">Gemini analyzes your performance to create targeted practice per course.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#0066cc] text-white px-5 py-2.5 rounded-full font-medium text-[14px] shadow-sm hover:bg-[#0055b3] transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Course
                  </button>
                </div>

                {loadingCourses ? (
                  <div className="flex flex-col items-center justify-center py-20 text-[#86868b]">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p>Loading courses...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((c) => (
                      <div 
                        key={c.id} 
                        onClick={() => openCourseDashboard(c)}
                        className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-black/[0.03] cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all group"
                      >
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                          <BookOpen size={24} />
                        </div>
                        <h3 className="text-[14px] font-bold text-[#86868b] tracking-wider uppercase mb-1">{c.code}</h3>
                        <h4 className="text-[18px] font-semibold text-[#1d1d1f] leading-tight mb-4">{c.title}</h4>
                        <div className="flex items-center gap-1.5 text-[#0066cc] text-[13px] font-medium mt-auto group-hover:gap-2 transition-all">
                          Start Prep <ChevronRight size={14} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'dashboard' && selectedCourse && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <DashboardView 
                course={selectedCourse}
                studentRoll={studentRoll}
                onPractice={(topic) => {
                  setSelectedTopic(topic);
                  setView('practice');
                }}
                onStudyPlan={() => setView('study-plan')}
                onCourseUpdated={setSelectedCourse}
              />
            </motion.div>
          )}

          {view === 'practice' && (
            <motion.div key="practice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <PracticeView 
                topic={selectedTopic} 
                courseId={selectedCourse?.id}
                onComplete={() => setView('dashboard')}
              />
            </motion.div>
          )}

          {view === 'study-plan' && (
            <motion.div key="study-plan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <StudyPlanView data={{ id: "student-id-123" }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Course Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-[24px] shadow-2xl border border-white/20 w-full max-w-[480px] overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Add New Course</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleAddCourse} className="p-6 flex flex-col gap-5">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-[13px] font-medium border border-red-100">
                      {errorMsg}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#1d1d1f]">Course Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. MATH101" 
                      value={newCode} onChange={(e) => setNewCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[14px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[#1d1d1f]">Course Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Introduction to Calculus" 
                      value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[14px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowAddModal(false)}
                      className="px-5 py-2.5 rounded-full font-medium text-[14px] text-[#515154] hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={addingCourse || !newCode.trim() || !newTitle.trim()}
                      className="bg-[#0066cc] text-white px-6 py-2.5 rounded-full font-medium text-[14px] shadow-sm hover:bg-[#0055b3] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {addingCourse && <Loader2 className="animate-spin" size={16} />}
                      Create Course
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Dashboard View (For a selected course) ---
function DashboardView({ course, studentRoll, onPractice, onStudyPlan, onCourseUpdated }: { course: any, studentRoll: string, onPractice: (t: any) => void, onStudyPlan: () => void, onCourseUpdated: (c: any) => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Materials Modal State
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [syllabusText, setSyllabusText] = useState(course.syllabusText || "");
  const [pastQuestionsText, setPastQuestionsText] = useState(course.pastQuestionsText || "");
  const [savingMaterials, setSavingMaterials] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/data/dashboard?roll=${studentRoll}&courseId=${course.id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json.student);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [studentRoll, course.id]);

  const handleSaveMaterials = async () => {
    setSavingMaterials(true);
    try {
      const res = await fetch(`/api/data/courses/${course.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ syllabusText, pastQuestionsText })
      });
      if (res.ok) {
        const data = await res.json();
        onCourseUpdated(data.course); // Update parent state with new texts
        setShowMaterialsModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingMaterials(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center text-[#86868b]">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-[14px] font-medium tracking-tight">Syncing performance data for {course.code}...</p>
      </div>
    );
  }

  if (!data) return <p className="text-center text-red-500">Failed to load data.</p>;

  const performances = data.performances || [];
  performances.sort((a: any, b: any) => a.masteryPercent - b.masteryPercent);

  return (
    <div className="max-w-[840px] mx-auto flex flex-col gap-8">
      {/* Hero Section */}
      <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-black/[0.03] flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight mb-2">Prep for {course.code}</h2>
          <p className="text-[#86868b] text-[15px] font-medium max-w-md">Gemini analyzes your past performance to generate targeted practice questions and optimized study plans.</p>
        </div>
        <div className="relative z-10 flex flex-col gap-3">
          <button 
            onClick={onStudyPlan}
            className="bg-[#0066cc] text-white px-6 py-3 rounded-full font-medium text-[14px] shadow-sm hover:bg-[#0055b3] transition-all flex items-center gap-2 hover:shadow-md hover:-translate-y-0.5 justify-center w-full"
          >
            <Target size={16} />
            Build My Study Plan
          </button>
          <button 
            onClick={() => setShowMaterialsModal(true)}
            className="bg-white border border-gray-200 text-[#1d1d1f] px-6 py-2.5 rounded-full font-medium text-[13px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <Settings2 size={14} />
            Manage AI Materials
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-[18px] font-semibold text-[#1d1d1f] mb-4 tracking-tight px-1">Topic Performance</h3>
        
        {performances.length === 0 ? (
          <div className="bg-white rounded-[16px] p-8 border border-black/[0.02] text-center shadow-sm">
            <p className="text-[#86868b] text-[15px] font-medium">No performance data recorded for this course yet.</p>
            <p className="text-[#86868b] text-[13px] mt-1">Start by practicing topics or using the Mind Map.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performances.map((perf: any) => {
              const isWeak = perf.masteryPercent < 60;
              return (
                <div key={perf.id} className="bg-white rounded-[16px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-black/[0.02] flex flex-col hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-[16px] font-semibold text-[#1d1d1f] tracking-tight">{perf.topic.name}</h3>
                      {isWeak && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit">
                          <AlertCircle size={10} /> Needs Review
                        </span>
                      )}
                    </div>
                    <div className={`text-[18px] font-bold tracking-tight ${perf.masteryPercent < 50 ? 'text-red-500' : perf.masteryPercent < 75 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {perf.masteryPercent}%
                    </div>
                  </div>
                  
                  <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden mb-5">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        perf.masteryPercent < 50 ? 'bg-red-500' : 
                        perf.masteryPercent < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${perf.masteryPercent}%` }}
                    />
                  </div>

                  <button 
                    onClick={() => onPractice(perf.topic)}
                    className="mt-auto w-full py-2 bg-gray-50 group-hover:bg-blue-50 text-[#1d1d1f] group-hover:text-[#0066cc] rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    Practice Topic <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Materials Modal */}
      <AnimatePresence>
        {showMaterialsModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] shadow-2xl border border-white/20 w-full max-w-[600px] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">Manage AI Materials</h3>
                  <p className="text-[12px] text-[#86868b] mt-0.5">Gemini will use this context to tailor its practice questions.</p>
                </div>
                <button onClick={() => setShowMaterialsModal(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#1d1d1f] flex items-center justify-between">
                    Course Syllabus / Topics
                    <span className="text-[11px] font-normal text-gray-400 font-mono">{syllabusText.length} chars</span>
                  </label>
                  <textarea 
                    placeholder="Paste the course syllabus, curriculum, or high-level topics here..." 
                    value={syllabusText} onChange={(e) => setSyllabusText(e.target.value)}
                    className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-[#1d1d1f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-sans"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[#1d1d1f] flex items-center justify-between">
                    Past Questions / Exams Reference
                    <span className="text-[11px] font-normal text-gray-400 font-mono">{pastQuestionsText.length} chars</span>
                  </label>
                  <textarea 
                    placeholder="Paste past exam questions here. Gemini will mimic their style and difficulty..." 
                    value={pastQuestionsText} onChange={(e) => setPastQuestionsText(e.target.value)}
                    className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-[#1d1d1f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-sans"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3 mt-auto">
                <button 
                  onClick={() => setShowMaterialsModal(false)}
                  className="px-5 py-2.5 rounded-full font-medium text-[14px] text-[#515154] hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveMaterials}
                  disabled={savingMaterials}
                  className="bg-[#0066cc] text-white px-6 py-2.5 rounded-full font-medium text-[14px] shadow-sm hover:bg-[#0055b3] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {savingMaterials && <Loader2 className="animate-spin" size={16} />}
                  Save Materials
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Practice View ---
function PracticeView({ topic, courseId, onComplete }: { topic: any, courseId: string, onComplete: () => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const weakSubtopics = topic.subtopics?.filter((s: any) => s.importance === 'high').map((s: any) => s.name) || ["General"];
        const res = await fetch('/api/ai/practice/generate', {
          method: 'POST',
          body: JSON.stringify({ topicName: topic.name, weakSubtopics, courseId })
        });
        const data = await res.json();
        if (data.error) {
          console.warn("API Error:", data.error);
          setQuestions([]);
        } else {
          setQuestions(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (topic) loadQuestions();
  }, [topic, courseId]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    const q = questions[currentIndex];
    
    try {
      const res = await fetch('/api/ai/practice/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          question: q.question,
          correctAnswer: q.correctAnswer,
          studentAnswer: answer
        })
      });
      const data = await res.json();
      setEvaluation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    setAnswer("");
    setEvaluation(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      onComplete();
    }
  };

  if (loading) {
    return (
      <div className="w-full py-32 flex flex-col items-center text-[#86868b]">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <BrainCircuit size={24} className="animate-pulse" />
          </div>
        </div>
        <p className="text-[15px] font-medium">Gemini is generating targeted questions analyzing your course materials...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center text-[#1d1d1f]">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="font-medium text-[15px] mb-6">Failed to generate questions. Please ensure your API key is valid.</p>
        <button onClick={onComplete} className="bg-gray-100 px-6 py-2 rounded-full font-medium text-[13px] hover:bg-gray-200">Go Back</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-[700px] mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between text-[13px] font-medium text-[#86868b] px-1">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-blue-500' : i < currentIndex ? 'w-2 bg-emerald-500' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.02]">
        <h3 className="text-[18px] text-[#1d1d1f] font-medium mb-6 leading-relaxed tracking-tight">
          {currentQ.question}
        </h3>
        
        <textarea 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={!!evaluation || evaluating}
          placeholder="Type your answer here..."
          className="w-full h-[140px] p-5 rounded-[12px] border border-gray-200 bg-gray-50 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 resize-none disabled:opacity-60 transition-all leading-relaxed"
        />

        {!evaluation ? (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || evaluating}
              className="bg-[#0066cc] text-white px-8 py-2.5 rounded-full font-medium text-[14px] hover:bg-[#0055b3] flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-[#0066cc] transition-all shadow-sm"
            >
              {evaluating && <Loader2 className="animate-spin" size={16} />}
              {evaluating ? 'Evaluating...' : 'Submit to Gemini'}
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-8 p-6 rounded-[16px] border ${evaluation.isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
            <div className="flex items-center gap-2 mb-3">
              {evaluation.isCorrect ? <CheckCircle2 className="text-emerald-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />}
              <h4 className={`text-[16px] font-semibold tracking-tight ${evaluation.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                {evaluation.isCorrect ? 'Correct!' : 'Needs Revision'}
              </h4>
            </div>
            
            <p className="text-[15px] text-[#1d1d1f] mb-5 leading-relaxed bg-white/50 p-4 rounded-xl border border-black/[0.02]">{evaluation.feedback}</p>
            
            {evaluation.weakSubconceptDetected && (
              <div className="inline-flex items-center gap-2 bg-red-100/50 border border-red-200/50 px-3 py-1.5 rounded-lg text-[12px] text-red-700 font-medium mb-5">
                <Target size={14} /> Identified Weakness: {evaluation.weakSubconceptDetected}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-black/[0.03]">
              <button
                onClick={handleNext}
                className="bg-white border border-gray-200 text-[#1d1d1f] px-6 py-2 rounded-full font-medium text-[13px] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Practice'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Study Plan View ---
function StudyPlanView({ data }: { data: any }) {
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      try {
        const res = await fetch('/api/ai/study-plan', {
          method: 'POST',
          body: JSON.stringify({
            studentId: data.id,
            daysRemaining: 14,
            minutesAvailable: 120
          })
        });
        const planData = await res.json();
        if (planData.error) {
          console.warn("API Error:", planData.error);
          setPlan([]);
        } else {
          setPlan(Array.isArray(planData) ? planData : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [data.id]);

  if (loading) {
    return (
      <div className="w-full py-32 flex flex-col items-center text-[#86868b]">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Clock size={24} className="animate-pulse" />
          </div>
        </div>
        <p className="text-[15px] font-medium">Gemini is crunching your performance data to build the optimal study plan...</p>
      </div>
    );
  }

  if (plan.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center text-[#1d1d1f]">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="font-medium text-[15px]">Failed to generate study plan. Please ensure your API key is valid.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto flex flex-col gap-8 pb-12">
      <div className="bg-gradient-to-br from-[#f5f7fa] to-[#e4e9f2] rounded-[20px] p-8 border border-white/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 text-blue-900 pointer-events-none transform translate-x-4 -translate-y-4">
          <Target size={120} />
        </div>
        <h2 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight mb-2">120-Minute Action Plan</h2>
        <p className="text-[#515154] text-[15px] font-medium max-w-[480px] leading-relaxed">
          Prioritized dynamically based on topics with high exam frequency and your current mastery gaps.
        </p>
      </div>

      <div className="flex flex-col gap-5 relative before:absolute before:inset-0 before:ml-[31px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-blue-500 before:via-blue-300 before:to-transparent">
        {plan.map((step, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#f5f5f7] bg-white absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 shadow-sm z-10 text-blue-500 font-bold text-[18px]">
              {step.stepNumber}
            </div>
            
            <div className="w-[calc(100%-5rem)] md:w-[calc(50%-2.5rem)] ml-20 md:ml-0 bg-white rounded-[16px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.02] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all">
              <div className="flex items-center justify-between mb-3 gap-4">
                <h3 className="text-[16px] font-semibold text-[#1d1d1f] tracking-tight">{step.topic}</h3>
                <span className="shrink-0 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wide">
                  <Clock size={12} /> {step.durationMinutes}m
                </span>
              </div>
              <p className="text-[14px] text-[#515154] leading-relaxed">{step.action}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
