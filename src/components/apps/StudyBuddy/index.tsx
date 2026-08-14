"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, Calendar, MessageSquare } from "lucide-react";

export function StudyBuddy() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/data/tutors');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTutors(data.tutors);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate bg-cloud-white">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-body-md">Finding top student tutors...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-cloud-white flex flex-col">
      <div className="h-[56px] border-b border-border-light flex items-center px-6 shrink-0 sticky top-0 z-10 bg-cloud-white">
        <h2 className="text-display-md text-graphite flex items-center gap-2">
          <MessageSquare className="text-signal-blue" size={20} />
          Peer Study Buddy
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[800px] mx-auto">
          <p className="text-body-md text-slate mb-6">
            Connect with senior students who have mastered the courses you are struggling with.
            Tutors are ranked dynamically using Bayesian average based on their ratings.
          </p>

          <div className="flex flex-col gap-4">
            {tutors.map(tutor => (
              <div key={tutor.id} className="bg-cloud-white border border-border-light rounded-lg p-5 shadow-resting flex flex-col sm:flex-row gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-body-lg font-medium text-graphite">{tutor.student.name}</h3>
                    <div className="bg-surface-blue-tint text-signal-blue-dark text-caption px-2 py-0.5 rounded-sm">
                      Batch '{tutor.student.batch}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-amber mb-3 text-body-sm">
                    <Star size={16} fill="currentColor" />
                    <span className="font-medium text-graphite">{tutor.ratingAverage.toFixed(1)}</span>
                    <span className="text-slate">({tutor.ratingCount} reviews)</span>
                  </div>

                  <p className="text-body-sm text-slate mb-4 line-clamp-2">
                    {tutor.bio}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {tutor.parsedTopics.map((topic: string, i: number) => (
                      <span key={i} className="bg-surface-alt border border-border-light text-graphite text-caption px-2 py-1 rounded-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:w-[220px] bg-[#FAFAFB] border border-border-light rounded-md p-4 flex flex-col shrink-0">
                  <h4 className="text-body-sm font-medium text-graphite flex items-center gap-1 mb-3">
                    <Calendar size={14} className="text-slate" /> Next Available
                  </h4>
                  <div className="flex flex-col gap-2 mb-4">
                    {tutor.parsedAvailability.map((slot: string, i: number) => (
                      <div key={i} className="text-caption text-slate bg-cloud-white border border-border-light px-2 py-1 rounded-sm text-center">
                        {slot}
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-signal-blue text-cloud-white py-2 rounded-md text-body-sm font-medium hover:bg-signal-blue-dark transition-colors mt-auto">
                    Book Session
                  </button>
                </div>
              </div>
            ))}
            
            {tutors.length === 0 && (
              <p className="text-slate">No tutors available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
