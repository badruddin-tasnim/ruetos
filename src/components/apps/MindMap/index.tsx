"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Edge,
  Node,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2, X, Folder, FileText, FileVideo, Plus, ChevronRight, FileCode, MoreHorizontal, BookOpen, ArrowLeft, Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom node styles based on design tokens
const nodeStyles = {
  course: { background: '#255CFB', color: '#FFFFFF', border: '1px solid #1E4ED8', padding: '16px 24px', borderRadius: 12, fontWeight: 600, fontSize: 16, boxShadow: '0 4px 12px rgba(37,92,251,0.2)', width: 250 },
  chapter: { background: '#0FAD86', color: '#FFFFFF', border: '1px solid #0D9674', padding: '12px 20px', borderRadius: 10, fontWeight: 500, boxShadow: '0 4px 12px rgba(15,173,134,0.15)', width: 220 },
  topic: { background: '#FFFFFF', color: '#1d1d1f', border: '1px solid #e5e7eb', padding: '10px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', width: 200 },
  subtopic: { background: '#f8fafc', color: '#515154', border: '1px dashed #cbd5e1', padding: '8px 12px', borderRadius: 6, fontSize: 13, width: 180 },
};

const generateMockContents = (nodeType: string, label: string) => {
  return [
    { id: '1', type: 'folder', name: 'Lecture Notes', items: 3 },
    { id: '2', type: 'folder', name: 'Reference Materials', items: 5 },
    { id: '3', type: 'pdf', name: `${label} Summary.pdf`, size: '2.4 MB' },
    { id: '4', type: 'video', name: `Recording: ${label}.mp4`, size: '156 MB' },
    { id: '5', type: 'code', name: 'example_code.c', size: '4 KB' },
  ];
};

type ViewState = 'course-list' | 'mindmap';

export function MindMap() {
  const [view, setView] = useState<ViewState>('course-list');
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  
  // Modal state
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

  const openMindMap = (courseId: string) => {
    setSelectedCourseId(courseId);
    setView('mindmap');
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent relative">
      {/* App Header (Dashboard/List View) */}
      <div className="h-[60px] flex items-center justify-between px-8 shrink-0 bg-transparent sticky top-0 z-10 pt-2 border-b border-white/5">
        <div className="flex items-center gap-3 text-white/90 font-semibold text-[18px] tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm">
            <Network size={18} />
          </div>
          <span>Course Mind Maps</span>
        </div>
        
        {view === 'mindmap' && (
          <button 
            onClick={() => setView('course-list')}
            className="flex items-center gap-1.5 text-[#0066cc] hover:text-[#004499] transition-colors bg-blue-500/10/50 px-3 py-1.5 rounded-full text-[13px] font-medium"
          >
            <ArrowLeft size={14} />
            <span>Back to Courses</span>
          </button>
        )}
      </div>

      {view === 'course-list' ? (
        <div className="flex-1 overflow-y-auto p-8 pt-6 pb-20">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[28px] font-semibold text-white/90 tracking-tight">Your Courses</h2>
                <p className="text-white/60 text-[15px] font-medium mt-1">Select a course to explore its knowledge graph.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#0066cc] text-white px-5 py-2.5 rounded-full font-medium text-[14px] shadow-sm hover:bg-[#0055b3] transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Add Course
              </button>
            </div>

            {loadingCourses ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/60">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Loading courses...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => openMindMap(c.id)}
                    className="bg-[#252525] rounded-[20px] p-6 shadow-md border border-white/5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="text-[14px] font-bold text-white/60 tracking-wider uppercase mb-1">{c.code}</h3>
                    <h4 className="text-[18px] font-semibold text-white/90 leading-tight mb-4">{c.title}</h4>
                    <div className="flex items-center gap-1.5 text-[#0066cc] text-[13px] font-medium mt-auto group-hover:gap-2 transition-all">
                      Open Map <ChevronRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
           <MindMapCanvas courseId={selectedCourseId!} />
        </div>
      )}

      {/* Add Course Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#252525] rounded-[24px] shadow-2xl border border-white/20 w-full max-w-[480px] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1e1e1e]/50">
                <h3 className="text-[16px] font-semibold text-white/90">Add New Course</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
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
                  <label className="text-[13px] font-medium text-white/90">Course Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. MATH101" 
                    value={newCode} onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1e1e1e] text-[14px] focus:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-white/90">Course Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Introduction to Calculus" 
                    value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1e1e1e] text-[14px] focus:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-full font-medium text-[14px] text-white/70 hover:bg-[#2a2a2a] transition-colors"
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
  );
}

// --- Separated Canvas Component for a cleaner file structure ---

function MindMapCanvas({ courseId }: { courseId: string }) {
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/data/mindmap?courseId=${courseId}`);
        if (!res.ok) throw new Error("Course map not found");
        const { course } = await res.json();
        
        setCourseData(course);
        setExpandedNodes(new Set([`course-${course.id}`]));
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  useEffect(() => {
    if (!courseData) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    const edgeProps = {
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#9AA3B2', strokeWidth: 2 },
    };

    let currentY = 100;
    const ySpacing = 80;

    const cId = `course-${courseData.id}`;
    const courseExpanded = expandedNodes.has(cId);
    
    newNodes.push({
      id: cId,
      position: { x: 50, y: currentY },
      data: { label: `${courseData.code}: ${courseData.title} ${courseExpanded ? '▾' : '▸'}`, type: 'course', description: courseData.description, rawLabel: `${courseData.code}: ${courseData.title}` },
      style: nodeStyles.course,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });

    if (courseExpanded && courseData.chapters) {
      courseData.chapters.forEach((chapter: any) => {
        currentY += ySpacing;
        const chapterId = `chapter-${chapter.id}`;
        const chapterExpanded = expandedNodes.has(chapterId);
        
        newNodes.push({
          id: chapterId,
          position: { x: 350, y: currentY },
          data: { label: `${chapter.name} ${chapterExpanded ? '▾' : '▸'}`, type: 'chapter', rawLabel: chapter.name },
          style: nodeStyles.chapter,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        });
        
        newEdges.push({
          id: `e-${cId}-${chapterId}`,
          source: cId,
          target: chapterId,
          ...edgeProps,
          style: { stroke: '#0FAD86', strokeWidth: 2 }
        });

        if (chapterExpanded && chapter.topics) {
          chapter.topics.forEach((topic: any) => {
            currentY += ySpacing - 10;
            const topicId = `topic-${topic.id}`;
            const topicExpanded = expandedNodes.has(topicId);
            
            newNodes.push({
              id: topicId,
              position: { x: 620, y: currentY },
              data: { label: `${topic.name} ${topicExpanded ? '▾' : '▸'}`, type: 'topic', importance: topic.examFrequency, rawLabel: topic.name },
              style: nodeStyles.topic,
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
            });
            
            newEdges.push({
              id: `e-${chapterId}-${topicId}`,
              source: chapterId,
              target: topicId,
              ...edgeProps,
              style: { stroke: '#9AA3B2', strokeWidth: 1.5 }
            });

            if (topicExpanded && topic.subtopics) {
              topic.subtopics.forEach((subtopic: any) => {
                currentY += ySpacing - 20;
                const subtopicId = `subtopic-${subtopic.id}`;
                
                newNodes.push({
                  id: subtopicId,
                  position: { x: 880, y: currentY },
                  data: { label: subtopic.name, type: 'subtopic', importance: subtopic.importance, rawLabel: subtopic.name },
                  style: nodeStyles.subtopic,
                  sourcePosition: Position.Right,
                  targetPosition: Position.Left,
                });
                
                newEdges.push({
                  id: `e-${topicId}-${subtopicId}`,
                  source: topicId,
                  target: subtopicId,
                  ...edgeProps,
                  animated: false,
                  style: { stroke: '#cbd5e1', strokeWidth: 1.5, strokeDasharray: '4 4' },
                });
              });
            }
          });
        }
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [courseData, expandedNodes, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
    setSelectedNode(node);
  }, []);

  const closePanel = () => setSelectedNode(null);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-transparent text-white/60">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-[14px] font-medium tracking-tight">Loading Map...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
        <p>{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full bg-[#1c1c1e] overflow-hidden relative">
      <div className="flex-1 h-full relative">
        {nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            attributionPosition="bottom-right"
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Background color="rgba(0,0,0,0.05)" gap={24} size={1} />
            <Controls showInteractive={false} className="bg-[#252525]/80 backdrop-blur-md shadow-sm border border-black/5 rounded-lg overflow-hidden" />
          </ReactFlow>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
             No nodes available. Add chapters and topics to this course.
          </div>
        )}

        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#252525]/80 backdrop-blur-xl border border-black/5 shadow-sm rounded-full px-6 py-2.5 flex items-center gap-2 pointer-events-none z-10">
          <p className="text-white/90 text-[13px] font-medium tracking-tight">Click nodes to expand/collapse and view contents</p>
        </div>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[360px] h-full bg-[#252525]/80 backdrop-blur-2xl border-l border-white/5 shadow-[-8px_0_24px_rgba(0,0,0,0.03)] flex flex-col z-20 absolute right-0 top-0"
          >
            <div className="h-[60px] flex items-center justify-between px-5 border-b border-white/5 shrink-0 pt-2">
              <div className="flex items-center gap-2">
                <div className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  selectedNode.data.type === 'course' ? 'bg-blue-100 text-blue-700' :
                  selectedNode.data.type === 'chapter' ? 'bg-emerald-100 text-emerald-700' :
                  selectedNode.data.type === 'topic' ? 'bg-purple-100 text-purple-700' :
                  'bg-white/10 text-gray-700'
                }`}>
                  {selectedNode.data.type as string}
                </div>
              </div>
              <button onClick={closePanel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-gray-500">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <h2 className="text-[20px] font-semibold text-white/90 tracking-tight mb-2 leading-tight">
                {selectedNode.data.rawLabel as string}
              </h2>
              
              <div className="flex gap-2 mb-8 mt-4">
                <button className="flex-1 bg-[#0066cc] hover:bg-[#0055b3] text-white text-[13px] font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <Plus size={16} /> Add Content
                </button>
                <button className="w-9 h-9 bg-[#2a2a2a] hover:bg-white/10 text-white/90 rounded-lg flex items-center justify-center transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="mb-2">
                <h3 className="text-[12px] font-bold text-white/60 uppercase tracking-wider mb-3">Contents</h3>
                <div className="flex flex-col gap-1">
                  {generateMockContents(selectedNode.data.type as string, selectedNode.data.rawLabel as string).map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-2.5 hover:bg-blue-500/10/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-blue-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {item.type === 'folder' ? <Folder size={18} className="text-blue-500 fill-blue-500/20 shrink-0" /> :
                         item.type === 'pdf' ? <FileText size={18} className="text-red-500 shrink-0" /> :
                         item.type === 'video' ? <FileVideo size={18} className="text-purple-500 shrink-0" /> :
                         item.type === 'code' ? <FileCode size={18} className="text-emerald-500 shrink-0" /> :
                         <FileText size={18} className="text-gray-500 shrink-0" />}
                         
                        <div className="flex flex-col truncate">
                          <span className="text-[14px] text-white/90 font-medium truncate">{item.name}</span>
                          <span className="text-[11px] text-white/60">{item.type === 'folder' ? `${item.items} items` : item.size}</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center bg-[#1e1e1e]/50 text-center hover:bg-blue-500/10/30 hover:border-blue-300 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-[#252525] rounded-full shadow-sm border border-white/10 flex items-center justify-center text-gray-500 mb-3">
                  <Plus size={20} />
                </div>
                <p className="text-[13px] font-medium text-white/90 mb-1">Drag files here</p>
                <p className="text-[11px] text-white/60">or click to browse from your computer</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
